const express = require('express');
const app = express();
const port = 3000;
const pool = require('./db');
const router = require('./utils/router.js');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('connected to server!')
});

app.use('/reviews', router);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});

