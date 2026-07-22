const express = require('express');

const app = express();

// Tiny health/status endpoint.
app.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;

// Only start listening when run directly, so tests can import the app.
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
