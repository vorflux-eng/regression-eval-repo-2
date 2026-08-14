import { pathToFileURL } from "node:url";

export function parsePort(value) {
  if (value === undefined) return 3000;
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return null;
  const port = Number(text);
  return Number.isInteger(port) && port >= 1 && port <= 65535 ? port : null;
}

export function startServer({ app, port }) {
  return app.listen(port);
}

export function runCli({ createApp, env = process.env, stderr = process.stderr }) {
  const port = parsePort(env.PORT);
  if (port === null) {
    stderr.write("Invalid PORT: expected a decimal integer from 1 to 65535.\n");
    process.exitCode = 1;
    return 1;
  }
  return startServer({ app: createApp(), port });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { createApp } = await import("./app.js");
  runCli({ createApp });
}
