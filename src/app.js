const express = require("express");

const app = express();
const requestCounts = {
  "/healthz": 0,
  "/stats": 0,
};

function countRequest(req, _res, next) {
  const route = req.route.path;
  requestCounts[route] = (requestCounts[route] ?? 0) + 1;
  next();
}

app.get("/healthz", countRequest, (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", countRequest, (_req, res) => {
  res.status(200).json({ ...requestCounts });
});

module.exports = app;
