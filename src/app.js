const express = require("express");

const app = express();
const requestCounts = {};

app.use((req, res, next) => {
  res.once("finish", () => {
    if (req.route) {
      const path = req.route.path;
      requestCounts[path] = (requestCounts[path] || 0) + 1;
    }
  });

  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  res.status(200).json(requestCounts);
});

module.exports = app;
