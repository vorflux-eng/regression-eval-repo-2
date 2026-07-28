const http = require('node:http');

function handleRequest(request, response) {
  const pathname = request.url.split('?')[0];

  if (request.method === 'GET' && pathname === '/status') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  response.writeHead(404);
  response.end();
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(process.env.PORT || 3000);
}

module.exports = { server };
