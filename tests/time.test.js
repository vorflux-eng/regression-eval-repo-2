const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  const now = new Date("2026-10-22T05:49:54.000Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the current time as an ISO timestamp", async () => {
    const res = await request(app).get("/time");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ time: "2026-10-22T05:49:54.000Z" });
  });
});
