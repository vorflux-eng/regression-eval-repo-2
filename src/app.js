const express = require("express");

const app = express();
const requestCounts = {
  "/healthz": 0,
  "/stats": 0,
};

const countRequest = (route) => (_req, _res, next) => {
  requestCounts[route] += 1;
  next();
};

app.get("/healthz", countRequest("/healthz"), (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", countRequest("/stats"), (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
