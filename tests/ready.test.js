const request = require("supertest");
const app = require("../src/app");

describe("GET /ready", () => {
  it("returns 200 with { status: 'ok' }", async () => {
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/ready");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("does not accept POST requests", async () => {
    const res = await request(app).post("/ready");
    expect(res.status).toBe(404);
  });
});
