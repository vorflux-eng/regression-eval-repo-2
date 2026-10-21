const express = require("express");

const app = express();
const routeCounts = {
  "/healthz": 0,
  "/stats": 0,
};

app.get("/healthz", (_req, res) => {
  routeCounts["/healthz"] += 1;
  res.status(200).json({ status: "ok" });
});

app.get("/stats", (_req, res) => {
  routeCounts["/stats"] += 1;
  res.status(200).json(routeCounts);
});

module.exports = app;
