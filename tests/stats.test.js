const request = require("supertest");

describe("GET /stats", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require("../src/app");
  });

  it("returns request counts for each served route", async () => {
    const initialStats = await request(app).get("/stats");
    expect(initialStats.body).toEqual({});

    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({
      "/stats": 1,
      "/healthz": 2,
    });
  });

  it("does not count requests for unknown routes", async () => {
    await request(app).get("/unknown");

    const res = await request(app).get("/stats");
    expect(res.body).toEqual({});
  });

  it("does not count methods the route does not handle", async () => {
    await request(app).post("/healthz");

    const res = await request(app).get("/stats");
    expect(res.body).toEqual({});
  });

  it("counts HEAD requests handled by a GET route", async () => {
    await request(app).head("/healthz");

    const res = await request(app).get("/stats");
    expect(res.body).toEqual({ "/healthz": 1 });
  });
});
