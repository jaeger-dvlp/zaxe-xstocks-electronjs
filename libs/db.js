require('dotenv').config();
const mysql = require('mysql');

const { SQL_HNAME, SQL_UNAME, SQL_PORT, SQL_PWD, SQL_DBNAME } = process.env;

const pool = mysql.createPool({
  host: SQL_HNAME,
  user: SQL_UNAME,
  port: SQL_PORT,
  password: SQL_PWD,
  database: SQL_DBNAME,
  connectionLimit: 10,
  connectionTimeout: 10000,
});

module.exports = pool;
