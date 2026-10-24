'use strict';

const http = require('node:http');

function handler(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname === '/status') {
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' });
      return res.end();
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }
  res.writeHead(404);
  res.end();
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  http.createServer(handler).listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
}

module.exports = { handler };
