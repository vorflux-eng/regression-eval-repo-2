const request = require("supertest");
const app = require("../src/app");

describe("request logging", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(["/healthz", "/healthz/", "/HEALTHZ"])(
    "does not log requests to %s",
    async (path) => {
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await request(app).get(path).expect(200);

      expect(logSpy).not.toHaveBeenCalled();
    }
  );
});
