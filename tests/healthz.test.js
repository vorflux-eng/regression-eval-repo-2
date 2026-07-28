const request = require("supertest");
const app = require("../src/app");

describe("GET /healthz", () => {
  it("returns 200 with { status: 'ok' }", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/healthz");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
  });
});

describe("GET /stats", () => {
  it("returns request counts for served routes", async () => {
    await request(app).get("/healthz");
    await request(app).get("/healthz");

    const res = await request(app).get("/stats");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      "/healthz": expect.any(Number),
      "/stats": expect.any(Number),
    });
  });

  it("increments the count for each request to a route", async () => {
    await request(app).get("/healthz");
    const before = await request(app).get("/stats");
    await request(app).get("/healthz");
    const after = await request(app).get("/stats");

    expect(after.body["/healthz"]).toBe(before.body["/healthz"] + 1);
    expect(after.body["/stats"]).toBe(before.body["/stats"] + 1);
  });
});
