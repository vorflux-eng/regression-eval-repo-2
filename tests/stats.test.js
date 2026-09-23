const request = require("supertest");

describe("GET /stats", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require("../src/app");
  });

  it("returns JSON counts, including the current stats request", async () => {
    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ "/healthz": 0, "/stats": 1 });
  });

  it("counts each route independently across repeated requests", async () => {
    await request(app).get("/healthz").expect(200);
    await request(app).get("/healthz").expect(200);
    await request(app).get("/stats").expect(200);

    const res = await request(app).get("/stats");
    expect(res.body).toEqual({ "/healthz": 2, "/stats": 2 });
  });

  it("groups query strings and Express path variants under the route", async () => {
    await request(app).get("/healthz?check=one").expect(200);
    await request(app).get("/HEALTHZ/").expect(200);

    const res = await request(app).get("/stats?view=all");
    expect(res.body).toEqual({ "/healthz": 2, "/stats": 1 });
  });

  it("does not count unknown routes or unsupported methods", async () => {
    await request(app).get("/unknown").expect(404);
    await request(app).get("/__proto__").expect(404);
    await request(app).post("/healthz").expect(404);
    await request(app).post("/stats").expect(404);

    const res = await request(app).get("/stats");
    expect(res.body).toEqual({ "/healthz": 0, "/stats": 1 });
  });

  it("counts HEAD requests served by the GET routes", async () => {
    await request(app).head("/healthz").expect(200);
    await request(app).head("/stats").expect(200);

    const res = await request(app).get("/stats");
    expect(res.body).toEqual({ "/healthz": 1, "/stats": 2 });
  });

  it("counts concurrent requests without losing increments", async () => {
    await Promise.all(
      Array.from({ length: 20 }, () => request(app).get("/healthz").expect(200))
    );

    const res = await request(app).get("/stats");
    expect(res.body).toEqual({ "/healthz": 20, "/stats": 1 });
  });
});
