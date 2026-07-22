const request = require("supertest");
const app = require("../src/app");

describe("request logging exclusion for /healthz", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("does not log requests to /healthz", async () => {
    await request(app).get("/healthz");
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("does not log /healthz variants (trailing slash, case, query string)", async () => {
    await request(app).get("/healthz/");
    await request(app).get("/HEALTHZ");
    await request(app).get("/healthz?foo=bar");
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("logs requests to non-excluded routes", async () => {
    await request(app).get("/other");
    expect(logSpy).toHaveBeenCalledWith("GET /other");
  });
});
