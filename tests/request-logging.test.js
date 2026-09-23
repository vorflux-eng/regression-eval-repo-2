const request = require("supertest");
const app = require("../src/app");

describe("request logging", () => {
  let log;

  beforeEach(() => {
    log = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockRestore();
  });

  it.each(["/healthz", "/healthz?probe=ready"])(
    "does not log %s",
    async (path) => {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
      expect(log).not.toHaveBeenCalled();
    },
  );

  it.each(["/unknown", "/healthz-extra"])("logs GET %s", async (path) => {
    const res = await request(app).get(path);
    expect(res.status).toBe(404);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(`GET ${path}`);
  });
});
