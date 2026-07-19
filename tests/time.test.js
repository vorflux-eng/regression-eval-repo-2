const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  const FROZEN = new Date("2026-07-19T13:55:48.000Z");

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FROZEN);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns 200 with the current time (deterministic via fake timers)", async () => {
    const res = await request(app).get("/time");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ time: "2026-07-19T13:55:48.000Z" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/time");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
