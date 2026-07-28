const http = require('node:http');

function handleRequest(request, response) {
  if (request.method === 'GET' && request.url === '/status') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  response.writeHead(404);
  response.end();
}

function createServer() {
  return http.createServer(handleRequest);
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { createServer };
