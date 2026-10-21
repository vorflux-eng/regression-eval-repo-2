const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  const now = "2026-10-21T23:40:18.000Z";

  beforeEach(() => {
    jest.useFakeTimers({
      doNotFake: [
        "nextTick",
        "setImmediate",
        "clearImmediate",
        "setInterval",
        "clearInterval",
        "setTimeout",
        "clearTimeout",
        "queueMicrotask",
        "hrtime",
        "performance",
      ],
    });
    jest.setSystemTime(new Date(now));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the current time as an ISO string", async () => {
    const res = await request(app).get("/time");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ time: now });
  });
});
