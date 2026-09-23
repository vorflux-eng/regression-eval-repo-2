const request = require("supertest");

function loadFreshApp() {
  jest.resetModules();
  return require("../src/app");
}

describe("GET /stats", () => {
  it("returns request counts for each route", async () => {
    const app = loadFreshApp();

    await request(app).get("/healthz");
    await request(app).get("/healthz");
    await request(app).get("/unknown");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      "/healthz": 2,
      "/unknown": 1,
      "/stats": 1,
    });
  });

  it("counts query variants under the same route path", async () => {
    const app = loadFreshApp();

    await request(app).get("/healthz?source=monitor");

    const res = await request(app).get("/stats");

    expect(res.body).toEqual({
      "/healthz": 1,
      "/stats": 1,
    });
  });
});
