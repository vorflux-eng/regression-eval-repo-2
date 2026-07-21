const express = require("express");

const app = express();

// Maximum number of distinct routes tracked individually. Because unknown
// routes are counted by their (attacker-controllable) path, an unbounded map
// would be a memory-exhaustion vector. Once the limit is reached, counts for
// any further new routes are aggregated into an overflow bucket.
const MAX_TRACKED_ROUTES = 1000;
const OVERFLOW_KEY = "other";

// Tracks how many requests each route has served, keyed by "METHOD path".
const requestCounts = {};

// Count every incoming request by its method and route path.
app.use((req, res, next) => {
  const key = `${req.method} ${req.path}`;
  if (
    !Object.prototype.hasOwnProperty.call(requestCounts, key) &&
    Object.keys(requestCounts).length >= MAX_TRACKED_ROUTES
  ) {
    requestCounts[OVERFLOW_KEY] = (requestCounts[OVERFLOW_KEY] || 0) + 1;
  } else {
    requestCounts[key] = (requestCounts[key] || 0) + 1;
  }
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
