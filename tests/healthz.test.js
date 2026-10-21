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
  it("returns the request count for each served route", async () => {
    const initialStats = await request(app).get("/stats");
    const initialHealthzCount = initialStats.body["/healthz"] || 0;
    const initialStatsCount = initialStats.body["/stats"];

    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({
      "/healthz": initialHealthzCount + 2,
      "/stats": initialStatsCount + 1,
    });
  });

  it("does not count unknown routes", async () => {
    const initialStats = await request(app).get("/stats");

    await request(app).get("/unknown");

    const res = await request(app).get("/stats");

    expect(res.body["/unknown"]).toBeUndefined();
    expect(res.body["/stats"]).toBe(initialStats.body["/stats"] + 1);
  });
});
