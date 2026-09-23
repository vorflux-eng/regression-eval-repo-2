const express = require("express");

const app = express();
const requestCounts = { "/healthz": 0, "/stats": 0 };

function countRequest(req, _res, next) {
  requestCounts[req.route.path] += 1;
  next();
}

app.get("/healthz", countRequest, (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", countRequest, (_req, res) => {
  res.json(requestCounts);
});

module.exports = app;
