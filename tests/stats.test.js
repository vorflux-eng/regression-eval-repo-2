const request = require("supertest");
const app = require("../src/app");

describe("GET /stats", () => {
  it("returns the number of requests served by each route", async () => {
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
    const before = await request(app).get("/stats");

    await request(app).get("/unknown");

    const after = await request(app).get("/stats");
    expect(after.body).toEqual({
      ...before.body,
      "/stats": before.body["/stats"] + 1,
    });
  });
});
