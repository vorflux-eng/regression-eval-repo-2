const { spawn } = require("node:child_process");
const { once } = require("node:events");
const net = require("node:net");

test("startup fails when the port is unavailable", async () => {
  const occupiedPort = net.createServer();
  occupiedPort.listen(0);
  await once(occupiedPort, "listening");

  const { port } = occupiedPort.address();
  const child = spawn(process.execPath, ["src/index.js"], {
    cwd: __dirname + "/..",
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  try {
    const [exitCode] = await once(child, "close");
    expect(exitCode).toBe(1);
    expect(stdout).not.toMatch(/Server listening/);
    expect(stderr).toMatch(/EADDRINUSE/);
  } finally {
    child.kill();
    occupiedPort.close();
  }
}, 10_000);
