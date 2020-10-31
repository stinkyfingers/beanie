const express = require('express');
const router = require('./router');

const app = express();

app.use(router);
const port = 3001

if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'live') {
  console.log({ message: `running on port ${port}.`})
  app.listen(port);
}

module.exports = app;

// NOP
// NOP
