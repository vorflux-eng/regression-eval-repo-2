'use strict';

const http = require('node:http');

function handler(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (pathname === '/status') {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'method not allowed' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
}

function createServer() {
  return http.createServer(handler);
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
}

module.exports = { createServer };
