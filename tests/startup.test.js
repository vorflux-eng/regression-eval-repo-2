const { spawn } = require("node:child_process");
const { once } = require("node:events");
const net = require("node:net");
const path = require("node:path");

describe("server startup", () => {
  it("exits with an error when the port is unavailable", async () => {
    const blocker = net.createServer();
    blocker.listen(0);
    await once(blocker, "listening");

    const child = spawn(process.execPath, [path.join(__dirname, "../src/index.js")], {
      env: { ...process.env, PORT: String(blocker.address().port) },
    });

    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });

    try {
      const [exitCode] = await once(child, "exit");

      expect(exitCode).toBe(1);
      expect(stdout).not.toMatch(/Server listening/);
      expect(stderr).toMatch(/EADDRINUSE/);
    } finally {
      child.kill();
      blocker.close();
    }
  });
});
