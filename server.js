const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Only start the server when run directly (not when imported, e.g. by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
