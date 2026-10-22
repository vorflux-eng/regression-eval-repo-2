const request = require("supertest");

const loadFreshApp = () => {
  jest.resetModules();
  return require("../src/app");
};

describe("GET /stats", () => {
  it("returns request counts for each route", async () => {
    const app = loadFreshApp();

    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      "/healthz": 2,
      "/stats": 1,
    });
  });

  it("does not count requests to unknown routes", async () => {
    const app = loadFreshApp();

    await request(app).get("/unknown");
    const res = await request(app).get("/stats");

    expect(res.body).toEqual({
      "/healthz": 0,
      "/stats": 1,
    });
  });

  it("returns JSON content-type", async () => {
    const app = loadFreshApp();
    const res = await request(app).get("/stats");

    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
