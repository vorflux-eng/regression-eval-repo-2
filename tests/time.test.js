const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  it("returns the current server time as JSON", async () => {
    const beforeRequest = Date.now();
    const res = await request(app).get("/time");
    const afterRequest = Date.now();
    const responseTime = Date.parse(res.body.time);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ time: expect.any(String) });
    expect(Number.isNaN(responseTime)).toBe(false);
    expect(responseTime).toBeGreaterThanOrEqual(beforeRequest);
    expect(responseTime).toBeLessThanOrEqual(afterRequest);
  });
});
