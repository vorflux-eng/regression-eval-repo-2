const express = require("express");

const app = express();
const requestCounts = {};

app.use((req, _res, next) => {
  const route = req.path;
  requestCounts[route] = (requestCounts[route] || 0) + 1;
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
