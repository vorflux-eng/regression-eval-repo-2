const request = require("supertest");
const app = require("../src/app");

describe("GET /healthz", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 200 with { status: 'ok' }", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/healthz");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it.each([
    "/healthz",
    "/healthz/",
    "/HEALTHZ",
    "/healthz?probe=request-logging",
  ])(
    "does not log health check request %s",
    async (path) => {
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await request(app).get(path);

      expect(logSpy).not.toHaveBeenCalled();
    },
  );

  it("logs non-health requests", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await request(app).post("/unknown?probe=request-logging");

    expect(logSpy).toHaveBeenCalledWith(
      "POST /unknown?probe=request-logging",
    );
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
  });
});
