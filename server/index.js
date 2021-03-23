const express = require('express');
const app = express();
const port = 3000;
const pool = require('./db');
const router = require('./utils/router.js');
require('dotenv').config();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `http://${process.env.SERVER_IP}`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('connected to server!');
});

app.get(`/${process.env.LOADER}`, (req, res) => {
  res.status(200).send(process.env.LOADER)
})

app.use('/reviews', router);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
