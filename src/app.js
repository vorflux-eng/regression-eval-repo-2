const express = require("express");

const app = express();

app.use((req, res, next) => {
  if (req.path === "/healthz") {
    next();
    return;
  }

  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });

  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
