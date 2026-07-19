const express = require('express');

/**
 * Build and return the Express application.
 *
 * Exposes a single health check endpoint, `GET /healthz`, which responds with
 * HTTP 200 and a small JSON body indicating the service is up.
 *
 * @returns {import('express').Express} the configured Express app
 */
function createApp() {
  const app = express();

  app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
}

module.exports = createApp;
