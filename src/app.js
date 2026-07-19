const express = require("express");

const app = express();

// Request logging middleware. Skips the /healthz endpoint to avoid noise
// from frequent health-check polling.
app.use((req, res, next) => {
  if (req.path !== "/healthz") {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
