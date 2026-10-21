const request = require("supertest");

let app;

beforeEach(() => {
  jest.resetModules();
  app = require("../src/app");
});

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
  it("returns request counts for each served route", async () => {
    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      "GET /healthz": 2,
      "GET /stats": 1,
    });
  });

  it("does not count requests that do not match a route", async () => {
    await request(app).get("/unknown");

    const res = await request(app).get("/stats");

    expect(res.body).toEqual({
      "GET /healthz": 0,
      "GET /stats": 1,
    });
  });

  it("counts HEAD requests separately from GET requests", async () => {
    await request(app).head("/healthz");

    const res = await request(app).get("/stats");

    expect(res.body).toEqual({
      "GET /healthz": 0,
      "GET /stats": 1,
      "HEAD /healthz": 1,
    });
  });
});
