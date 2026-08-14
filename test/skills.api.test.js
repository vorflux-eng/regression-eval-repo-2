import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { createApp } from "../src/app.js";
import { VALIDATION_ISSUES } from "../src/skills/skills.validation.js";

test("GET exact mount returns the normative Express response", async () => {
  const response = await request(createApp()).get("/api/v1/skills/search?q=express&platform=api");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    data: [{
      id: "skill-express-routing", name: "Express Routing",
      description: "Define HTTP routes and middleware with Express.",
      platforms: ["api"], tags: ["express", "routing", "middleware"], relevanceScore: 121
    }],
    meta: { query: "express", platform: "api", sort: "relevance", count: 1 }
  });
});

test("HTTP search supports fields, sort normalization, omitted platform, and valid misses", async () => {
  const app = createApp();
  const descriptionHit = await request(app).get("/api/v1/skills/search?q=middleware&sort=ReLeVaNcE");
  assert.equal(descriptionHit.status, 200);
  assert.equal(descriptionHit.body.data[0].id, "skill-express-routing");
  assert.equal(descriptionHit.body.meta.platform, null);
  assert.equal(descriptionHit.body.meta.sort, "relevance");
  const miss = await request(app).get("/api/v1/skills/search?q=unfindable");
  assert.deepEqual(miss.body, { data: [], meta: { query: "unfindable", platform: null, sort: "relevance", count: 0 } });
});

test("HTTP validation has canonical details, simple repeated scalar rejection, and unknown keys", async () => {
  const response = await request(createApp())
    .get("/api/v1/skills/search?q=!&platform=unknown&sort=date&zebra=1&apple=2");
  assert.equal(response.status, 400);
  assert.deepEqual(response.body.error, {
    code: "VALIDATION_ERROR",
    message: "Invalid query parameters",
    details: [
      { field: "q", issue: VALIDATION_ISSUES.Q_NOT_MEANINGFUL },
      { field: "platform", issue: VALIDATION_ISSUES.PLATFORM_UNKNOWN },
      { field: "sort", issue: VALIDATION_ISSUES.SORT_UNSUPPORTED },
      { field: "query", issue: VALIDATION_ISSUES.UNKNOWN_QUERY_KEYS, keys: ["apple", "zebra"] }
    ]
  });
  const repeated = await request(createApp()).get("/api/v1/skills/search?q=ok&q=again");
  assert.equal(repeated.body.error.details[0].issue, VALIDATION_ISSUES.Q_SCALAR);
  const bracket = await request(createApp()).get("/api/v1/skills/search?q[name]=ok");
  assert.deepEqual(bracket.body.error.details, [
    { field: "q", issue: VALIDATION_ISSUES.Q_REQUIRED },
    { field: "query", issue: VALIDATION_ISSUES.UNKNOWN_QUERY_KEYS, keys: ["q[name]"] }
  ]);
});

test("HTTP enforces raw and normalized boundaries", async () => {
  const app = createApp();
  const cases = [
    ["q", " ".repeat(513), VALIDATION_ISSUES.Q_RAW_TOO_LONG],
    ["q", "é".repeat(101), VALIDATION_ISSUES.Q_NORMALIZED_TOO_LONG],
    ["platform", " ".repeat(257), VALIDATION_ISSUES.PLATFORM_RAW_TOO_LONG],
    ["sort", " ".repeat(65), VALIDATION_ISSUES.SORT_RAW_TOO_LONG]
  ];
  for (const [field, value, issue] of cases) {
    const response = await request(app)
      .get("/api/v1/skills/search")
      .query({ q: "ok", [field]: value });
    assert.equal(response.status, 400);
    assert.ok(response.body.error.details.some((detail) => detail.issue === issue));
  }
});

test("injected catalog platform display values work for allowlisting and filtering", async () => {
  const catalog = [{
    id: "custom", name: "Custom Skill", description: "Useful custom search.",
    platforms: ["ＡＰＩ"], tags: ["custom"]
  }];
  const response = await request(createApp({ catalog })).get("/api/v1/skills/search?q=custom&platform=Api");
  assert.equal(response.status, 200);
  assert.equal(response.body.meta.platform, "api");
  assert.deepEqual(response.body.data[0].platforms, ["ＡＰＩ"]);
});

test("non-GET methods and unknown routes use terminal JSON 404", async () => {
  for (const method of ["post", "put", "delete", "options"]) {
    const response = await request(createApp())[method]("/api/v1/skills/search?q=express");
    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { error: { code: "NOT_FOUND", message: "Route not found" } });
  }
  const response = await request(createApp()).get("/not-a-route");
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: { code: "NOT_FOUND", message: "Route not found" } });
});

test("thrown and rejected injected searches are sanitized", async () => {
  for (const search of [
    () => { throw new Error("secret failure detail"); },
    async () => Promise.reject(new Error("another secret detail"))
  ]) {
    const response = await request(createApp({ search })).get("/api/v1/skills/search?q=express");
    assert.equal(response.status, 500);
    assert.deepEqual(response.body, { error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    assert.equal(JSON.stringify(response.body).includes("secret"), false);
  }
});
