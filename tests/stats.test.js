const request = require("supertest");

describe("request counting and GET /stats", () => {
  let app;

  beforeEach(() => {
    // Fresh app (and fresh counters) for each test.
    jest.resetModules();
    app = require("../src/app");
  });

  it("returns 200 with JSON", async () => {
    const res = await request(app).get("/stats");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("starts with no counts", async () => {
    const res = await request(app).get("/stats");
    expect(res.body).toEqual({});
  });

  it("counts requests per route", async () => {
    await request(app).get("/healthz");
    await request(app).get("/healthz");
    const res = await request(app).get("/stats");
    expect(res.body["GET /healthz"]).toBe(2);
  });

  it("counts /stats requests too (excluding the reporting request)", async () => {
    await request(app).get("/stats");
    const res = await request(app).get("/stats");
    expect(res.body["GET /stats"]).toBe(1);
  });

  it("does not count unmatched (404) routes", async () => {
    await request(app).get("/does-not-exist");
    const res = await request(app).get("/stats");
    expect(res.body["GET /does-not-exist"]).toBeUndefined();
    expect(res.body).toEqual({});
  });
});
