const request = require("supertest");
const app = require("../src/app");

describe("GET /healthz", () => {
  it("returns 200 with { status: 'ok' }", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/healthz");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
  });
});

describe("GET /stats", () => {
  it("returns the number of requests served by each route", async () => {
    const before = await request(app).get("/stats");

    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const after = await request(app).get("/stats");

    expect(after.status).toBe(200);
    expect(after.headers["content-type"]).toMatch(/application\/json/);
    expect(after.body["/healthz"]).toBe((before.body["/healthz"] || 0) + 2);
    expect(after.body["/stats"]).toBe(before.body["/stats"] + 1);
  });

  it("does not count unknown routes", async () => {
    const before = await request(app).get("/stats");

    await request(app).get("/unknown");

    const after = await request(app).get("/stats");
    expect(Object.keys(after.body)).toEqual(Object.keys(before.body));
    expect(after.body["/healthz"]).toBe(before.body["/healthz"]);
  });
});
