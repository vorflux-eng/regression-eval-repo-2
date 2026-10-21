const express = require("express");

const app = express();
const requestCounts = {};

const track = (method, path, handler) => {
  const route = `${method} ${path}`;
  requestCounts[route] = 0;

  app[method.toLowerCase()](path, (req, res, next) => {
    requestCounts[route] += 1;
    return handler(req, res, next);
  });
};

track("GET", "/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

track("GET", "/stats", (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
