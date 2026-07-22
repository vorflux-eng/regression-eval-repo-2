const express = require("express");

const app = express();

// Tracks how many requests each route has served, keyed by "METHOD /path".
const requestCounts = Object.create(null);

// Count each request once its response is finished. Keying off the matched
// route (req.route) rather than the raw URL keeps the map bounded to real
// routes and avoids inflating counts with unmatched (404) paths.
app.use((req, res, next) => {
  res.on("finish", () => {
    const route = req.route?.path;
    if (!route) {
      return;
    }
    // Prepend the router mount path (req.baseUrl) so routes with the same
    // local path under different mounted routers (e.g. /users/:id vs
    // /teams/:id) are counted separately. For top-level routes baseUrl is "".
    const key = `${req.method} ${req.baseUrl}${route}`;
    requestCounts[key] = (requestCounts[key] || 0) + 1;
  });
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
