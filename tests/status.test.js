const request = require("supertest");
const app = require("../src/app");

describe("/status", () => {
  it("returns 200 with an OK status for GET requests", async () => {
    const res = await request(app).get("/status?probe=1");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("supports HEAD requests", async () => {
    const res = await request(app).head("/status");

    expect(res.status).toBe(200);
  });
});
