const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-10-21T20:22:45.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 200 with the current time in ISO 8601 format", async () => {
    const res = await request(app).get("/time");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ time: "2026-10-21T20:22:45.000Z" });
  });
});
