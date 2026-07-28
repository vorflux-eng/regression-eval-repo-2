const request = require("supertest");
const { version } = require("../package.json");
const app = require("../src/app");

describe("GET /version", () => {
  it("returns the package version", async () => {
    const res = await request(app).get("/version");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ version });
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/version");

    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
