const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  it("returns 200 with JSON content-type", async () => {
    const res = await request(app).get("/time");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("returns the current server time as an ISO 8601 string", async () => {
    const before = Date.now();
    const res = await request(app).get("/time");
    const after = Date.now();

    expect(Object.keys(res.body)).toEqual(["time"]);
    expect(typeof res.body.time).toBe("string");
    expect(new Date(res.body.time).toISOString()).toBe(res.body.time);

    const returned = Date.parse(res.body.time);
    expect(returned).toBeGreaterThanOrEqual(before);
    expect(returned).toBeLessThanOrEqual(after);
  });
});
