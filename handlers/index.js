const dbGetConnection = (dbPool) => {
  return new Promise((resolve, reject) => {
    dbPool.getConnection((dbErr, connection) => {
      if (dbErr) {
        console.log(`Database Connection Error: ${dbErr}`);
        reject(dbErr);
      }
      resolve(connection);
    });
  });
};

const getTableByName = (dbPool, tableName) => {
  return new Promise((resolve, reject) => {
    dbGetConnection(dbPool)
      .then((connection) => {
        connection.query(`SELECT * FROM ${tableName}`, (queryErr, results) => {
          connection.release();
          if (queryErr) {
            console.log(`Query Err: ${queryErr}`);
            reject(queryErr);
          }
          resolve(results);
        });
      })
      .catch((connErr) => reject(connErr));
  });
};

const controlInternetConnection = (dnsModule) => {
  return new Promise((resolve, reject) => {
    dnsModule.lookup('f.root-servers.net', (err) => {
      if (err && err.code === 'ENOTFOUND') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  getTableByName,
  controlInternetConnection,
};
