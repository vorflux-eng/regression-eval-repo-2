const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the current time as an ISO timestamp", async () => {
    const now = new Date("2026-07-21T10:10:02.000Z");
    jest.useFakeTimers().setSystemTime(now);

    const res = await request(app).get("/time");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ time: "2026-07-21T10:10:02.000Z" });
  });
});
