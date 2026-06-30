const request = require("supertest");

const app = require("../server");

describe("GET /healthz (server.js)", () => {
  it("returns 200 with { status: 'ok' }", async () => {
    const response = await request(app).get("/healthz").expect(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
