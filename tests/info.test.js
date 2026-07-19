const request = require("supertest");
const app = require("../src/app");
const pkg = require("../package.json");

describe("GET /info", () => {
  it("returns 200 with package metadata", async () => {
    const res = await request(app).get("/info");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
    });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/info");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
