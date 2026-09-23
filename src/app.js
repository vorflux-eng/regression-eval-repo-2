const express = require("express");

const app = express();

app.use((req, res, next) => {
  if (req.path !== "/healthz") {
    res.on("finish", () => {
      console.log(`${req.method} ${req.path} ${res.statusCode}`);
    });
  }
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
