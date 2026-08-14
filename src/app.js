const express = require("express");

const app = express();
const requestCounts = new Map();

app.use((req, res, next) => {
  res.once("finish", () => {
    if (req.route) {
      const route = `${req.baseUrl || ""}${req.route.path}`;
      requestCounts.set(route, (requestCounts.get(route) || 0) + 1);
    }
  });

  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  res.status(200).json(Object.fromEntries(requestCounts));
});

module.exports = app;
