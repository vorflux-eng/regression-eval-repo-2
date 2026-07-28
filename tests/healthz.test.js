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
  it("returns request counts for each registered route", async () => {
    const before = await request(app).get("/stats");

    await request(app).get("/healthz");
    await request(app).get("/healthz");
    await request(app).get("/unknown");

    const after = await request(app).get("/stats");

    expect(after.status).toBe(200);
    expect(after.headers["content-type"]).toMatch(/application\/json/);
    expect(after.body).toEqual({
      "/healthz": before.body["/healthz"] + 2,
      "/stats": before.body["/stats"] + 1,
    });
  });
});
