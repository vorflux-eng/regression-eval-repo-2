const express = require("express");

const app = express();
const requestCounts = Object.create(null);

function countRequest(route) {
  return (_req, _res, next) => {
    requestCounts[route] = (requestCounts[route] || 0) + 1;
    next();
  };
}

app.get("/healthz", countRequest("/healthz"), (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", countRequest("/stats"), (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
