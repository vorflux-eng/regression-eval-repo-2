const express = require("express");

const app = express();
const requestCounts = Object.create(null);

const countRequests = (route) => (_req, _res, next) => {
  requestCounts[route] = (requestCounts[route] || 0) + 1;
  next();
};

app.get("/healthz", countRequests("/healthz"), (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", countRequests("/stats"), (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
