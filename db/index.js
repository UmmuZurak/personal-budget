require("dotenv/config");
const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = query;
