const express = require('express');

const app = express();

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
