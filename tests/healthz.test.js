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
  it("returns request counts for each route", async () => {
    jest.resetModules();
    const freshApp = require("../src/app");

    const initialStats = await request(freshApp).get("/stats");
    expect(initialStats.body).toEqual({ "/healthz": 0, "/stats": 1 });

    await request(freshApp).get("/unknown");

    await request(freshApp).get("/healthz");
    await request(freshApp).get("/healthz");

    const res = await request(freshApp).get("/stats");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ "/healthz": 2, "/stats": 2 });
  });
});
