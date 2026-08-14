const http = require("node:http");

const server = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/status") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  response.writeHead(404);
  response.end();
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = server;
