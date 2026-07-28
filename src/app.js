const express = require("express");

const app = express();
const requestCounts = { "/healthz": 0, "/stats": 0 };

app.get("/healthz", (_req, res) => {
  requestCounts["/healthz"] += 1;
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  requestCounts["/stats"] += 1;
  res.status(200).json(requestCounts);
});

module.exports = app;
