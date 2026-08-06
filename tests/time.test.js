const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the current time as an ISO timestamp", async () => {
    const now = new Date("2026-08-06T01:36:01.000Z");
    jest.useFakeTimers({
      doNotFake: [
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval",
        "setImmediate",
        "clearImmediate",
        "nextTick",
        "queueMicrotask",
        "hrtime",
        "performance",
      ],
      now,
    });

    const res = await request(app).get("/time");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ time: "2026-08-06T01:36:01.000Z" });
  });
});
