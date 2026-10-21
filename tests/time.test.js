const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 200 with the current time in ISO 8601 format", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-10-21T21:35:37.000Z"));

    const res = await request(app).get("/time");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ time: "2026-10-21T21:35:37.000Z" });
  });
});
