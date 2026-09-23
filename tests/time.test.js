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
    const time = Date.parse(res.body.time);
    expect(time).toBeGreaterThanOrEqual(before);
    expect(time).toBeLessThanOrEqual(after);
    expect(res.body.time).toBe(new Date(time).toISOString());
  });

  it("calculates the time for each request", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    jest.setSystemTime(new Date("2026-09-23T10:00:00.000Z"));
    const first = await request(app).get("/time");

    jest.setSystemTime(new Date("2026-09-23T10:01:00.000Z"));
    const second = await request(app).get("/time");

    expect(first.body).toEqual({ time: "2026-09-23T10:00:00.000Z" });
    expect(second.body).toEqual({ time: "2026-09-23T10:01:00.000Z" });
  });
});
