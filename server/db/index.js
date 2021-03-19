const dotenv = require('dotenv');
const pg = require('pg');
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;