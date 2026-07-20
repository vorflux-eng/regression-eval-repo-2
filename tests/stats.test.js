const request = require("supertest");
const app = require("../src/app");

describe("GET /stats", () => {
  it("returns 200 with JSON content-type", async () => {
    const res = await request(app).get("/stats");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("counts requests per route", async () => {
    // Fresh app instance so counts are isolated from other tests.
    jest.resetModules();
    const freshApp = require("../src/app");

    await request(freshApp).get("/healthz");
    await request(freshApp).get("/healthz");
    await request(freshApp).get("/unknown");

    const res = await request(freshApp).get("/stats");
    expect(res.status).toBe(200);
    expect(res.body["GET /healthz"]).toBe(2);
    expect(res.body["GET /unknown"]).toBe(1);
    // The /stats request itself is counted (this is the first GET /stats).
    expect(res.body["GET /stats"]).toBe(1);
  });
});
