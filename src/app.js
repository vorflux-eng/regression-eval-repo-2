const express = require("express");

const app = express();
const requestCounts = Object.create(null);

function countRequest(route) {
  requestCounts[route] = (requestCounts[route] || 0) + 1;
}

app.get("/healthz", (_req, res) => {
  countRequest("/healthz");
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  countRequest("/stats");
  res.status(200).json(requestCounts);
});

module.exports = app;
