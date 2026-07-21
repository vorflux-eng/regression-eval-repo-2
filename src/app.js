const express = require("express");

const app = express();

// Request logging middleware. Skips /healthz to avoid noise from health checks.
app.use((req, _res, next) => {
  if (req.path !== "/healthz") {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
