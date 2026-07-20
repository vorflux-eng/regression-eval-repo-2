const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  it("returns 200 with an ISO-8601 time string", async () => {
    const res = await request(app).get("/time");
    expect(res.status).toBe(200);
    expect(typeof res.body.time).toBe("string");
    expect(new Date(res.body.time).toISOString()).toBe(res.body.time);
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/time");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("returns a time close to now", async () => {
    const before = Date.now();
    const res = await request(app).get("/time");
    const after = Date.now();
    const t = new Date(res.body.time).getTime();
    expect(t).toBeGreaterThanOrEqual(before - 1000);
    expect(t).toBeLessThanOrEqual(after + 1000);
  });
});
