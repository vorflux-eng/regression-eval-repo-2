const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;

  if (path === "/status") {
    if (req.method !== "GET") {
      res.writeHead(405, { "Content-Type": "application/json", Allow: "GET" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = server;
