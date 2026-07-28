const express = require('express');

const app = express();

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(process.env.PORT || 3000);
