const request = require("supertest");

describe("request counting and GET /stats", () => {
  let app;

  beforeEach(() => {
    // Reset module state so counts start fresh for each test.
    jest.resetModules();
    app = require("../src/app");
  });

  it("returns 200 with JSON counts", async () => {
    const res = await request(app).get("/stats");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("counts requests per route", async () => {
    await request(app).get("/healthz");
    await request(app).get("/healthz");
    const res = await request(app).get("/stats");
    expect(res.body["GET /healthz"]).toBe(2);
  });

  it("tracks counts for distinct routes separately", async () => {
    await request(app).get("/healthz");
    await request(app).get("/unknown");
    const res = await request(app).get("/stats");
    expect(res.body["GET /healthz"]).toBe(1);
    expect(res.body["GET /unknown"]).toBe(1);
  });

  it("includes requests to /stats itself", async () => {
    const res = await request(app).get("/stats");
    expect(res.body["GET /stats"]).toBe(1);
  });

  it("caps tracked routes and aggregates overflow into 'other'", async () => {
    // Exceed the per-route tracking limit with many distinct paths so the
    // counts map cannot grow without bound.
    for (let i = 0; i < 1100; i++) {
      await request(app).get(`/r-${i}`);
    }
    const res = await request(app).get("/stats");
    const keyCount = Object.keys(res.body).length;
    expect(keyCount).toBeLessThanOrEqual(1001); // 1000 tracked + overflow bucket
    expect(res.body.other).toBeGreaterThan(0);
  });
});
