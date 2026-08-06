const express = require("express");

const app = express();
const requestCounts = Object.create(null);

app.use((req, res, next) => {
  res.on("finish", () => {
    if (!req.route) {
      return;
    }

    const route = `${req.baseUrl || ""}${req.route.path}`;
    requestCounts[route] = (requestCounts[route] || 0) + 1;
  });

  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  res.json(requestCounts);
});

module.exports = app;
