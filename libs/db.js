require('dotenv').config();
const mysql = require('mysql');
const dns = require('dns');
const { dialog } = require('electron');
const { controlInternetConnection } = require('../handlers');

const { SQL_HNAME, SQL_UNAME, SQL_PORT, SQL_PWD, SQL_DBNAME } = process.env;

const pool = mysql.createPool({
  connectionLimit: 10,
  connectTimeout: 10000,
  host: SQL_HNAME,
  user: SQL_UNAME,
  port: SQL_PORT,
  password: SQL_PWD,
  database: SQL_DBNAME,
});

controlInternetConnection(dns)
  .then(() => {
    pool.query('SELECT 1 + 1 AS solution', (queryErr, results) => {
      if (queryErr) {
        console.log(`Query Error: ${queryErr}`);
      }
      console.log(`Query Test: 1+1=${results[0].solution}`);
    });
  })
  .catch(() => {
    dialog.showMessageBoxSync({
      type: 'error',
      title: 'Hata',
      message:
        'Lütfen internet bağlantınızı kontrol edip sonra tekrar girmeyi deneyiniz!',
      buttons: ['OK'],
    });
    process.exit();
  });

module.exports = pool;
