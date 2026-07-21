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

  it("logs requests to non-healthz routes", async () => {
    await request(app).get("/unknown");
    expect(logSpy).toHaveBeenCalledWith("GET /unknown");
  });
});
