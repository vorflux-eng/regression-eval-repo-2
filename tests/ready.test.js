const request = require("supertest");
const app = require("../src/app");

describe("GET /ready", () => {
  it("returns 200 with { status: 'ready' }", async () => {
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ready" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/ready");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
