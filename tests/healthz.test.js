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

  it.each(["/healthz", "/healthz/", "/HEALTHZ"])(
    "does not log health check request %s",
    async (path) => {
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await request(app).get(path).expect(200);

      expect(logSpy).not.toHaveBeenCalled();
    },
  );

  it("logs non-health requests", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await request(app).get("/unknown");

    expect(logSpy).toHaveBeenCalledWith("GET /unknown");
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
  });
});
