const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  const FIXED = new Date("2026-07-21T14:20:24.000Z");

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns 200 with the current time as an ISO string", async () => {
    const res = await request(app).get("/time");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ time: "2026-07-21T14:20:24.000Z" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/time");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
