const request = require("supertest");
const app = require("../src/app");

describe("GET /healthz", () => {
  it("returns 200 with { status: 'ok' }", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/healthz");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("does not log health check requests", async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      await request(app).get("/healthz");
      expect(log).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it("logs unknown requests and preserves the 404 response", async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      const res = await request(app).get("/unknown?probe=1");
      expect(res.status).toBe(404);
      expect(log).toHaveBeenCalledWith("GET /unknown?probe=1");
    } finally {
      log.mockRestore();
    }
  });
});
