const express = require("express");

const app = express();
app.disable("x-powered-by");

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/status", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
