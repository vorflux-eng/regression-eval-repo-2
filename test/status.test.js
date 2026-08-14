const assert = require("node:assert/strict");
const { test } = require("node:test");

const { createServer } = require("../server");

test("GET /status returns the service status", async (t) => {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/status`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});
