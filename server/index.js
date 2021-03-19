const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const pg = require('pg');
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.json());

app.get('/', (req, res) => {
  pool.query('SELECT * FROM reviews WHERE product=17')
  .then(data => res.status(200).send(data))
  .catch(err =>
    res.status(400).send(err)
  )
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});

