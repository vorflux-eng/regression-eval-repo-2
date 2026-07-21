const request = require("supertest");

let app;

describe("GET /stats", () => {
  beforeEach(() => {
    jest.resetModules();
    app = require("../src/app");
  });

  it("starts with zero counts for routes that have not been requested", async () => {
    const res = await request(app).get("/stats");

    expect(res.body).toEqual({
      "/healthz": 0,
      "/stats": 1,
    });
  });

  it("returns request counts for each served route", async () => {
    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const firstStats = await request(app).get("/stats");
    expect(firstStats.status).toBe(200);
    expect(firstStats.body).toEqual({
      "/healthz": 2,
      "/stats": 1,
    });

    const secondStats = await request(app).get("/stats");
    expect(secondStats.body).toEqual({
      "/healthz": 2,
      "/stats": 2,
    });
  });

  it("does not count requests to unknown routes", async () => {
    await request(app).get("/unknown");

    const res = await request(app).get("/stats");
    expect(res.body).toEqual({
      "/healthz": 0,
      "/stats": 1,
    });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/stats");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
