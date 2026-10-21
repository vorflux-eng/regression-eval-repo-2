const request = require("supertest");
const app = require("../src/app");

describe("GET /stats", () => {
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

  it("does not count requests that do not match a route", async () => {
    await request(app).get("/unknown");

    const res = await request(app).get("/stats");
    expect(res.body).not.toHaveProperty("/unknown");
  });
});
