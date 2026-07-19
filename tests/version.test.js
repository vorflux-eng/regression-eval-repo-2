const request = require("supertest");
const app = require("../src/app");
const { version } = require("../package.json");

describe("GET /version", () => {
  it("returns 200 with the package version", async () => {
    const res = await request(app).get("/version");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ version });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/version");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("exposes a non-empty version string", async () => {
    const res = await request(app).get("/version");
    expect(typeof res.body.version).toBe("string");
    expect(res.body.version.length).toBeGreaterThan(0);
  });
});
