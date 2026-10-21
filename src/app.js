const express = require("express");

const app = express();
// Counts are process-local and reset when the server restarts.
const requestCounts = Object.create(null);

const countRequest = (route) => (_req, _res, next) => {
  // Count before handling so /stats includes the request that reads it.
  requestCounts[route] = (requestCounts[route] || 0) + 1;
  next();
};

app.get("/healthz", countRequest("/healthz"), (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", countRequest("/stats"), (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
