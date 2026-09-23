const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  it("returns 200 with the current server time as ISO 8601 JSON", async () => {
    const before = Date.now();
    const res = await request(app).get("/time");
    const after = Date.now();

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(Object.keys(res.body)).toEqual(["time"]);
    expect(typeof res.body.time).toBe("string");

    const timestamp = Date.parse(res.body.time);
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
    expect(res.body.time).toBe(new Date(timestamp).toISOString());
  });

  it("generates a fresh timestamp for each request", async () => {
    const first = await request(app).get("/time");
    await new Promise((resolve) => setTimeout(resolve, 20));
    const second = await request(app).get("/time");

    expect(Date.parse(second.body.time)).toBeGreaterThan(
      Date.parse(first.body.time)
    );
  });
});
