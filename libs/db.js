require("dotenv").config();
const mysql = require("mysql");

const { SQL_HNAME, SQL_UNAME, SQL_PORT, SQL_PWD, SQL_DBNAME } = process.env;

const connection = mysql.createConnection({
  host: SQL_HNAME,
  user: SQL_UNAME,
  port: SQL_PORT,
  password: SQL_PWD,
  database: SQL_DBNAME,
});

connection.connect();

module.exports = connection;
