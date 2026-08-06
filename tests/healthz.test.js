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
    const initialStats = await request(app).get("/stats");
    const initialHealthzCount = initialStats.body["/healthz"] || 0;
    const initialStatsCount = initialStats.body["/stats"] || 0;

    await request(app).get("/healthz");
    await request(app).get("/healthz");
    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body["/healthz"]).toBe(initialHealthzCount + 2);
    expect(res.body["/stats"]).toBe(initialStatsCount + 1);
  });

  it("does not count requests that do not match a route", async () => {
    await request(app).get("/unknown");
    const res = await request(app).get("/stats");

    expect(res.body).not.toHaveProperty("/unknown");
  });

  it("does not count methods that do not match a route", async () => {
    const initialStats = await request(app).get("/stats");
    const initialHealthzCount = initialStats.body["/healthz"] || 0;

    await request(app).post("/healthz");
    const res = await request(app).get("/stats");

    expect(res.body["/healthz"] || 0).toBe(initialHealthzCount);
  });

  it("counts equivalent URLs under the matched route", async () => {
    const initialStats = await request(app).get("/stats");
    const initialHealthzCount = initialStats.body["/healthz"] || 0;

    await request(app).get("/healthz/");
    await request(app).get("/HEALTHZ");
    const res = await request(app).get("/stats");

    expect(res.body["/healthz"]).toBe(initialHealthzCount + 2);
    expect(res.body).not.toHaveProperty("/healthz/");
    expect(res.body).not.toHaveProperty("/HEALTHZ");
  });
});
