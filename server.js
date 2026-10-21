const http = require('node:http');

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;

  if (pathname === '/status' && ['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (pathname === '/status') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  response.writeHead(404);
  response.end();
});

if (require.main === module) {
  server.listen(Number(process.env.PORT) || 3000);
}

module.exports = server;
