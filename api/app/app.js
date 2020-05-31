const express = require('express');
const router = require('./router');

const app = express();

app.use(router);

if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'live') {
  app.listen(3001);
}

module.exports = app;

// NOP
// NOP
