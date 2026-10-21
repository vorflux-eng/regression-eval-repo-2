const request = require("supertest");

describe("GET /stats", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require("../src/app");
  });

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

  it("counts each request to the stats route", async () => {
    await request(app).get("/stats");

    const res = await request(app).get("/stats");

    expect(res.body["/stats"]).toBe(2);
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
