const http = require('node:http');

function createServer() {
  return http.createServer((request, response) => {
    if (!request.url.startsWith('/') || request.url.startsWith('//')) {
      response.writeHead(400);
      response.end();
      return;
    }

    const [pathname] = request.url.split('?', 1);

    if (request.method === 'GET' && pathname === '/status') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    response.writeHead(404);
    response.end();
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { createServer };
