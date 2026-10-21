const net = require("node:net");
const request = require("supertest");
const app = require("../src/app");

describe("/status", () => {
  it("returns 200 with JSON status", async () => {
    const res = await request(app).get("/status");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("accepts query parameters", async () => {
    const res = await request(app).get("/status?probe=1");

    expect(res.status).toBe(200);
  });

  it("supports HEAD requests", async () => {
    const res = await request(app).head("/status");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.text).toBeUndefined();
  });

  it("returns 405 with allowed methods for unsupported methods", async () => {
    const res = await request(app).post("/status");

    expect(res.status).toBe(405);
    expect(res.headers.allow).toBe("GET, HEAD");
  });

  it("stays available after a malformed request target", async () => {
    const server = app.listen(0);
    const { port } = server.address();

    try {
      const rawResponse = await new Promise((resolve, reject) => {
        const socket = net.createConnection(port, "127.0.0.1", () => {
          socket.end("GET //[ HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n");
        });
        let data = "";

        socket.setEncoding("utf8");
        socket.on("data", (chunk) => { data += chunk; });
        socket.on("end", () => resolve(data));
        socket.on("error", reject);
      });

      expect(rawResponse).toMatch(/^HTTP\/1\.1 404/);
      expect((await request(server).get("/status")).status).toBe(200);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
