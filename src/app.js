const express = require("express");

const app = express();

// Health check route is defined BEFORE the request logger so that Express's
// own route matching handles it and it bypasses logging entirely. This avoids
// brittle manual URL checks and correctly excludes case, trailing-slash, and
// query-string variants of /healthz.
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Request logging for all routes defined after this point. /healthz above is
// not affected because its handler is reached first.
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

module.exports = app;
