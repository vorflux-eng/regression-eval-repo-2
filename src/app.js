const express = require("express");
const { version } = require("../package.json");

const app = express();

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/version", (_req, res) => {
  res.status(200).json({ version });
});

module.exports = app;
