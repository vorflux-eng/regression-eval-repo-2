const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the current time as an ISO timestamp", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-10-22T05:43:13.000Z"));

    const res = await request(app).get("/time");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ time: "2026-10-22T05:43:13.000Z" });
  });
});
