const request = require("supertest");
const app = require("../src/app");

beforeEach(() => {
  for (const route of Object.keys(app.locals.requestCounts)) {
    delete app.locals.requestCounts[route];
  }
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
  it("returns the number of requests served by each route", async () => {
    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      "/healthz": 2,
      "/stats": 1,
    });
  });

  it("does not count requests to unknown routes", async () => {
    await request(app).get("/unknown");

    const res = await request(app).get("/stats");

    expect(res.body).toEqual({ "/stats": 1 });
  });
});
