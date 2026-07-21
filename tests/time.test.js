const request = require("supertest");
const app = require("../src/app");

describe("GET /time", () => {
  it("returns 200 with the current server time", async () => {
    const res = await request(app).get("/time");
    expect(res.status).toBe(200);
    expect(typeof res.body.time).toBe("string");
    expect(new Date(res.body.time).toISOString()).toBe(res.body.time);
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/time");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
