const request = require("supertest");

describe("GET /stats", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require("../src/app");
  });

  it("returns request counts for each route", async () => {
    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({
      "/healthz": 2,
      "/stats": 1,
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
});
