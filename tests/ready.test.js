const request = require("supertest");
const app = require("../src/app");

describe("GET /ready", () => {
  it("returns 200 JSON with { ready: true }", async () => {
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ready: true });
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
