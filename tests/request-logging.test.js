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
      await request(app).get(path).expect(200);
      expect(log).not.toHaveBeenCalled();
    }
  );

  it.each(["/unknown", "/healthz-extra"])(
    "logs %s once without adding a route",
    async (path) => {
      await request(app).get(path).expect(404);
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(`GET ${path} 404`);
    }
  );
});
