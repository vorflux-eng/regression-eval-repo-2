const request = require("supertest");
const app = require("../src/app");

describe("request logging", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("logs requests outside the health check", async () => {
    await request(app).get("/unknown");

    expect(logSpy).toHaveBeenCalledWith("GET /unknown");
  });

  it.each(["/healthz", "/healthz/", "/HEALTHZ"])(
    "does not log health check requests to %s",
    async (path) => {
      await request(app).get(path);

      expect(logSpy).not.toHaveBeenCalled();
    },
  );
});
