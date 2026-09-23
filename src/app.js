const express = require("express");

const app = express();

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/time", (_req, res) => {
  res.status(200).json({ time: new Date().toISOString() });
});

module.exports = app;
