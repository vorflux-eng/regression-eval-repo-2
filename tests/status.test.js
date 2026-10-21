const request = require("supertest");
const app = require("../src/app");

describe("GET /status", () => {
  it("returns 200 with { status: 'ok' }", async () => {
    const res = await request(app).get("/status");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: "ok" });
  });
});
