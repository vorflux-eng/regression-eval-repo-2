const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  const FIXED_DATE = new Date("2026-07-22T06:25:54.000Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 200 with the current time as an ISO string", async () => {
    const res = await request(app).get("/time");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ time: "2026-07-22T06:25:54.000Z" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/time");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
