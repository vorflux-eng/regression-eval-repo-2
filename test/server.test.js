const assert = require("node:assert/strict");
const test = require("node:test");

const { createServer } = require("../server");

test("GET /status returns an ok status", async (t) => {
  const server = createServer().listen(0);
  t.after(() => server.close());

  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  for (const query of ["", "?probe=1"]) {
    const response = await fetch(`http://127.0.0.1:${port}/status${query}`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  }
});
