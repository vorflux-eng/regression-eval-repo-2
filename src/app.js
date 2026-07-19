const express = require("express");

const app = express();

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/ping", (_req, res) => {
  res.status(200).json({ message: "pong" });
});

module.exports = app;
