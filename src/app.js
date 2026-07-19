const express = require("express");
const pkg = require("../package.json");

const app = express();

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/info", (_req, res) => {
  res.status(200).json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  });
});

module.exports = app;
