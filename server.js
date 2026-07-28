const http = require('node:http');

function handleRequest(request, response) {
  const pathname = new URL(request.url, 'http://localhost').pathname;

  if (request.method === 'GET' && pathname === '/status') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'not found' }));
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  http.createServer(handleRequest).listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { handleRequest };
