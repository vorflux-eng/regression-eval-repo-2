const request = require("supertest");
const app = require("../src/app");

describe("GET /stats", () => {
  it("returns the number of requests served by each route", async () => {
    await request(app).get("/healthz").expect(200);
    await request(app).get("/healthz").expect(200);
    await request(app).get("/unknown").expect(404);

    const firstStats = await request(app).get("/stats");

    expect(firstStats.status).toBe(200);
    expect(firstStats.headers["content-type"]).toMatch(/application\/json/);
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
});
