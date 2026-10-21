const express = require("express");

const app = express();

app.use((req, _res, next) => {
  if (req.path !== "/healthz") {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
