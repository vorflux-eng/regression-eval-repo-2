const express = require("express");

const app = express();

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

module.exports = app;
