const request = require("supertest");
const app = require("../src/app");

describe("GET /stats", () => {
  it("returns the number of requests served by each route", async () => {
    const before = await request(app).get("/stats");

    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const after = await request(app).get("/stats");

    expect(after.status).toBe(200);
    expect(after.headers["content-type"]).toMatch(/application\/json/);
    expect(after.body).toEqual({
      "/healthz": before.body["/healthz"] + 2,
      "/stats": before.body["/stats"] + 1,
    });
  });

  it("does not count requests that do not match a route", async () => {
    const before = await request(app).get("/stats");
    await request(app).get("/unknown");
    const after = await request(app).get("/stats");

    expect(after.body["/healthz"]).toBe(before.body["/healthz"]);
    expect(after.body["/stats"]).toBe(before.body["/stats"] + 1);
  });
});
