const request = require("supertest");

function loadFreshApp() {
  jest.resetModules();
  return require("../src/app");
}

describe("GET /stats", () => {
  it("returns request counts for each served route", async () => {
    const app = loadFreshApp();

    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ "/healthz": 2, "/stats": 1 });
  });

  it("increments the stats route count on every request", async () => {
    const app = loadFreshApp();

    await request(app).get("/stats");
    const res = await request(app).get("/stats");

    expect(res.body).toEqual({ "/stats": 2 });
  });

  it("does not count unknown routes", async () => {
    const app = loadFreshApp();

    await request(app).get("/unknown");
    const res = await request(app).get("/stats");

    expect(res.body).toEqual({ "/stats": 1 });
  });
});
