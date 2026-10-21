const express = require("express");

const app = express();
const requestCounts = Object.create(null);

function countedGet(path, handler) {
  requestCounts[path] = 0;
  app.get(path, (req, res, next) => {
    requestCounts[path] += 1;
    return handler(req, res, next);
  });
}

countedGet("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

countedGet("/stats", (_req, res) => {
  res.status(200).json({ ...requestCounts });
});

module.exports = app;
