import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import test from "node:test";
import { parsePort, runCli, startServer } from "../src/server.js";

test("parsePort accepts only defined decimal ports", () => {
  assert.equal(parsePort(undefined), 3000);
  assert.equal(parsePort("03000"), 3000);
  assert.equal(parsePort(" 65535 "), 65535);
  for (const value of ["", " ", "+3000", "-1", "3.5", "1e3", "0xBB8", "0", "65536"]) {
    assert.equal(parsePort(value), null, value);
  }
});

test("startServer invokes an injected listener once and returns its handle", () => {
  const handle = {};
  const calls = [];
  const app = { listen(port) { calls.push(port); return handle; } };
  assert.equal(startServer({ app, port: 4321 }), handle);
  assert.deepEqual(calls, [4321]);
});

test("runCli validates before constructing an app or listening", () => {
  let constructed = false;
  let output = "";
  const previousExitCode = process.exitCode;
  assert.equal(runCli({
    createApp: () => { constructed = true; },
    env: { PORT: "invalid" },
    stderr: { write(text) { output += text; } }
  }), 1);
  assert.equal(constructed, false);
  assert.equal(output, "Invalid PORT: expected a decimal integer from 1 to 65535.\n");
  assert.equal(process.exitCode, 1);
  process.exitCode = previousExitCode;
});

test("runCli constructs and listens after a valid port", () => {
  const handle = {};
  let created = 0;
  let port;
  const result = runCli({
    createApp: () => {
      created += 1;
      return { listen(value) { port = value; return handle; } };
    },
    env: { PORT: "3100" }
  });
  assert.equal(result, handle);
  assert.equal(created, 1);
  assert.equal(port, 3100);
});

test("direct invalid startup emits the canonical error and exits nonzero", async () => {
  const child = spawn(process.execPath, ["src/server.js"], {
    cwd: process.cwd(), env: { ...process.env, PORT: "bad" }, stdio: ["ignore", "pipe", "pipe"]
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  const exitCode = await new Promise((resolve) => child.on("close", resolve));
  assert.equal(exitCode, 1);
  assert.equal(stderr, "Invalid PORT: expected a decimal integer from 1 to 65535.\n");
});

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchWithRetry(url, attempts = 30) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error(`Unexpected status: ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(25);
  }
  throw lastError;
}

test("direct valid startup serves the normative endpoint on an available port", async () => {
  const port = await getAvailablePort();
  const child = spawn(process.execPath, ["src/server.js"], {
    cwd: process.cwd(), env: { ...process.env, PORT: String(port) }, stdio: "ignore"
  });
  try {
    const response = await fetchWithRetry(`http://127.0.0.1:${port}/api/v1/skills/search?q=express&platform=api`);
    assert.deepEqual(await response.json(), {
      data: [{
        id: "skill-express-routing", name: "Express Routing",
        description: "Define HTTP routes and middleware with Express.",
        platforms: ["api"], tags: ["express", "routing", "middleware"], relevanceScore: 121
      }],
      meta: { query: "express", platform: "api", sort: "relevance", count: 1 }
    });
  } finally {
    if (child.exitCode === null) {
      child.kill();
      await new Promise((resolve) => child.on("close", resolve));
    }
  }
});
