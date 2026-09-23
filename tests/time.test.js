const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 200 with the current server time as JSON", async () => {
    const before = Date.now();
    const res = await request(app).get("/time");
    const after = Date.now();

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(Object.keys(res.body)).toEqual(["time"]);
    const timestamp = Date.parse(res.body.time);
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
    expect(res.body.time).toBe(new Date(timestamp).toISOString());
  });

  it("reads the server clock for each request", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const first = await request(app).get("/time");

    jest.setSystemTime(new Date("2026-01-01T00:00:01.000Z"));
    const second = await request(app).get("/time");

    expect(first.body).toEqual({ time: "2026-01-01T00:00:00.000Z" });
    expect(second.body).toEqual({ time: "2026-01-01T00:00:01.000Z" });
  });
});
