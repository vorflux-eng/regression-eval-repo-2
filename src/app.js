const express = require("express");

const app = express();
const requestCounts = {};

const track = (method, path, handler) => {
  requestCounts[`${method} ${path}`] = 0;

  app[method.toLowerCase()](path, (req, res, next) => {
    const route = `${req.method} ${path}`;
    requestCounts[route] = requestCounts[route] || 0;
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
