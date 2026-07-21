const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  it("returns the current server time as JSON", async () => {
    const currentTime = new Date("2026-07-21T10:14:07.000Z");
    jest.useFakeTimers();
    jest.setSystemTime(currentTime);

    try {
      const res = await request(app).get("/time");

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
      expect(res.body).toEqual({ time: currentTime.toISOString() });
    } finally {
      jest.useRealTimers();
    }
  });
});
