const express = require("express");

const app = express();
const sendOkStatus = (_req, res) => res.status(200).json({ status: "ok" });

app.get("/healthz", sendOkStatus);
app.get("/status", sendOkStatus);

module.exports = app;
