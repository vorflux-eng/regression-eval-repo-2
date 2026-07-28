const request = require("supertest");
const app = require("../src/app");
const { version } = require("../package.json");

describe("GET /version", () => {
  it("returns the application version as JSON", async () => {
    const res = await request(app).get("/version");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ version });
  });
});
