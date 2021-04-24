const catchError = (connection) => {
  connection.on('error', (error) => {
    console.log(error, 'ECONNREFUSED Q Q Q');
  });
};

const controlConnection = (connection) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM printers', (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  catchError,
  controlConnection,
};
