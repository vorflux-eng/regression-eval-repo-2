const express = require('express');

const app = express();

// Health check: reports that the process is up and able to serve requests.
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
