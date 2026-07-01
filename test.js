const assert = require('assert');
const { spawn } = require('child_process');

const port = 3100;
const server = spawn(process.execPath, ['server.js'], {
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

async function waitForServer(url, attempts = 20) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      return response;
    } catch (_error) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error('Server did not start in time');
}

async function run() {
  try {
    const response = await waitForServer(`http://127.0.0.1:${port}/healthz`);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(await response.json(), { status: 'ok' });
  } finally {
    server.kill();
  }
}

run().catch((error) => {
  server.kill();
  console.error(error);
  process.exit(1);
});
