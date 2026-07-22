const express = require('express');

const app = express();

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

// Only start the server when run directly, so the app can be imported in tests.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
