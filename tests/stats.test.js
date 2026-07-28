const request = require("supertest");

describe("GET /stats", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require("../src/app");
  });

  it("returns counts keyed by registered route path", async () => {
    await request(app).get("/healthz").expect(200);
    await request(app).get("/healthz").expect(200);

    const res = await request(app).get("/stats").expect(200);

    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({
      "/healthz": 2,
    });
  });

  it("reports only stats requests completed before the current response", async () => {
    const first = await request(app).get("/stats").expect(200);
    const second = await request(app).get("/stats").expect(200);

    expect(first.body).toEqual({});
    expect(second.body).toEqual({ "/stats": 1 });
  });

  it("does not count requests to unregistered routes", async () => {
    await request(app).get("/unknown").expect(404);

    const res = await request(app).get("/stats").expect(200);

    expect(res.body).toEqual({});
  });

  it("groups route variants under the registered path", async () => {
    await request(app).get("/healthz/").expect(200);
    await request(app).get("/healthz?source=test").expect(200);

    const res = await request(app).get("/stats").expect(200);

    expect(res.body).toEqual({ "/healthz": 2 });
  });

  it("counts routes registered through the exported app", async () => {
    app.get("/ready", (_req, res) => {
      res.status(200).json({ status: "ready" });
    });

    await request(app).get("/ready").expect(200);

    const res = await request(app).get("/stats").expect(200);

    expect(res.body).toEqual({ "/ready": 1 });
  });

  it("counts routes registered through app.route", async () => {
    app.route("/routed").get((_req, res) => {
      res.status(200).json({ status: "routed" });
    });

    await request(app).get("/routed").expect(200);

    const res = await request(app).get("/stats").expect(200);

    expect(res.body).toEqual({ "/routed": 1 });
  });

  it("counts same-path next('route') fallthrough only once", async () => {
    app.get("/fallback", (_req, _res, next) => {
      next("route");
    });
    app.get("/fallback", (_req, res) => {
      res.status(200).json({ status: "handled" });
    });

    await request(app).get("/fallback").expect(200);

    const res = await request(app).get("/stats").expect(200);

    expect(res.body).toEqual({ "/fallback": 1 });
  });
});
