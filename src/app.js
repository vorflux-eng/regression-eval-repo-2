const express = require("express");

const app = express();

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/status", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.all("/status", (_req, res) => {
  res.set("Allow", "GET, HEAD").sendStatus(405);
});

module.exports = app;
