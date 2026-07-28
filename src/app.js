const express = require("express");

const app = express();
const requestCounts = {};

function getWithRequestCount(path, handler) {
  requestCounts[path] = 0;
  app.get(path, (req, res, next) => {
    requestCounts[path] += 1;
    return handler(req, res, next);
  });
}

getWithRequestCount("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

getWithRequestCount("/stats", (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
