const express = require("express");

const app = express();

// Tracks how many requests each route has served, keyed by "METHOD PATH".
const requestCounts = Object.create(null);

// Count every incoming request by its method and path.
app.use((req, _res, next) => {
  const key = `${req.method} ${req.path}`;
  requestCounts[key] = (requestCounts[key] || 0) + 1;
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
