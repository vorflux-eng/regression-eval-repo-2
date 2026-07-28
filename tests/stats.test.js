const request = require("supertest");

let app;

beforeEach(() => {
  jest.resetModules();
  app = require("../src/app");
});

describe("GET /stats", () => {
  it("returns the number of requests served by each route", async () => {
    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const firstStats = await request(app).get("/stats");

    expect(firstStats.status).toBe(200);
    expect(firstStats.headers["content-type"]).toMatch(/application\/json/);
    expect(firstStats.body).toEqual({
      "/healthz": 2,
      "/stats": 1,
    });

    await request(app).get("/healthz");
    await request(app).get("/unknown");

    const secondStats = await request(app).get("/stats");

    expect(secondStats.body).toEqual({
      "/healthz": 3,
      "/stats": 2,
    });
  });
});
