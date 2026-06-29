'use strict';

const http = require('http');
const { greet } = require('./greeting');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let name = 'World';

  try {
    // Use a fixed, safe base so a malformed Host header or absolute
    // request-target cannot make URL parsing throw out of the handler.
    const requestUrl = new URL(req.url || '/', 'http://localhost');
    name = requestUrl.searchParams.get('name') || 'World';
  } catch (err) {
    // Malformed request data: fall back to the default greeting.
    name = 'World';
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(greet(name));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Greeting server listening on port ${port}`);
});
