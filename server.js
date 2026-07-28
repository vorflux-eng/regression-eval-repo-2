const http = require('node:http');

function createServer() {
  return http.createServer((request, response) => {
    const { pathname } = new URL(request.url, 'http://localhost');

    if (request.method === 'GET' && pathname === '/status') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    response.writeHead(404);
    response.end();
  });
}

if (require.main === module) {
  createServer().listen(process.env.PORT || 3000);
}

module.exports = { createServer };
