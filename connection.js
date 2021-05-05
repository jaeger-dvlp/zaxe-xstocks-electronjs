const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "remotemysql.com",
    user: "fkN8CQyvcb",
    port: "3306",
    password: "gDgyXzlGQJ",
    database: "fkN8CQyvcb"

})

/*

*/
connection.connect()


module.exports = {
    db: connection
}








/*
    if (err) {
        console.log(err.code);
        console.log(err.fatal);
        //mwindow.webContents.send("noconn", "Sunucu Bağlantısı Yok.");
    }
    else {
        mwindow.webContents.send("yeconn", "Sunucu Bağlantısı Mevcut.");
        console.log("1");

        $query = 'SELECT * FROM printers';
        connection.query($query, function (err, rows, fields) {
            if (err) {
                console.log("Query Err");
                console.log(err);
                return;
            }

            console.log("Query ok", rows);

        })

        connection.end();
    }
*/