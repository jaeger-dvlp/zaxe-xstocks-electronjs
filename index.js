const electron = require("electron");
const url = require("url");
const path = require("path");
const mysql = require("mysql");
const db = require("./connection").db;
const { ipcMain, Menu } = require('electron')

const { app, BrowserWindow, Tray } = electron;

let mwindow;

app.on("ready", () => {
    mwindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        movable: true,
        maximizable: false,
        fullscreenable: false,
        frame: false,
        center: true,
        resizable: true,
        backgroundColor: '#00ff0000',
        hasShadow: true,
        titleBarStyle: 'hidden',
        width: 1200,
        height: 700,
        maxWidth: 1920,
        maxHeight: 1080,
        minWidth: 800,
        minHeight: 700,
        title: "Zaxe Stocks",
        transparent: true,
        icon: path.join(__dirname, "rsc/logoico.ico"),
    });


    db.on("error", (err) => {
        console.log(err, "ECONNREFUSED Q Q Q");
    })


    mwindow.webContents.once("dom-ready", () => {

        db.query("SELECT * FROM printers", (error, results, fields) => {
            db.on("error", (err) => {
                console.log(err, "ECONNREFUSED Q Q Q");
            })
            console.log(error, results);
            if (error) {
                console.log("SSSSSSS");
                mwindow.webContents.send("noconn", "Sunucu Bağlantısı Yok.");
                //10

            }
            else {
                mwindow.webContents.send("init", results);
                mwindow.webContents.send("yeconn", "Sunucu Bağlantısı Mevcut.");

            }

            db.destroy();

        }
        )


    })

    mwindow.loadURL(
        url.format(
            {
                pathname: path.join(__dirname, "mwindow.html"),
                slashes: true
            }
        )
    );



    const devtools = Menu.buildFromTemplate(mainmenu);
    Menu.setApplicationMenu(devtools);




    //mwindow.openDevTools();



    ipcMain.on("min", (err, data) => {

        mwindow.minimize();

    })

    ipcMain.on("ext", (err, data) => {

        mwindow.close();

    })

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }







    var win = 0;

    ipcMain.on("lck", (err, data) => {

        if (win == 0) {
            mwindow.maximize();
            mwindow.webContents.send("mainup", "")
            win++;
        }
        else {
            win = 0;
            mwindow.unmaximize();
            mwindow.webContents.send("maindown", "")
        }


    })




    var conn;

    ipcMain.on("con", (e, data) => {

        conn = data;


    })

    ipcMain.on("cnc", (e, data) => {
        const db = mysql.createConnection({
            host: "remotemysql.com",
            user: "fkN8CQyvcb",
            port: "3306",
            password: "gDgyXzlGQJ",
            database: "fkN8CQyvcb"
        })

        db.connect(function (err) {
            db.on("error", (err) => {
                console.log(err, "ECONNREFUSED Q Q Q");
            })
            if (err) {

                db.on("error", (err) => {
                    console.log(err, "ECONNREFUSED Q Q Q");
                })
                mwindow.webContents.send("noconn", "Sunucu Bağlantısı Yok.");
                db.destroy();
                return;
            }


            if (conn != true) {
                db.query("SELECT * FROM printers", (error, results, fields) => {
                    db.on("error", (err) => {
                        console.log(err, "ECONNREFUSED Q Q Q");
                    })

                    console.log(error, results);
                    if (error) {
                        console.log("SSSSSSS");
                        mwindow.webContents.send("noconn", "Sunucu Bağlantısı Yok.");
                        //10
                        db.destroy();
                    }
                    else {
                        mwindow.webContents.send("init", results);
                        mwindow.webContents.send("yeconn", "Sunucu Bağlantısı Mevcut.");
                        db.destroy();
                    }

                    mwindow.webContents.send("yeconn", "Sunucu Bağlantısı Mevcut.");

                    if (error) console.log(error);
                    db.destroy();
                })
            }
            db.on("ECONNREFUSED", (err) => {
                console.log(err);
            })

            db.on("ECONNREFUSED", (err) => {
                console.log(err);
            })

        })


        /*
        db.connect(function (error) {
 
            console.log(error);
            if (error) {
                console.log("SSSSSSS");
                mwindow.webContents.send("noconn", "Sunucu Bağlantısı Yok.");
                //10
 
            }
            else {
 
                mwindow.webContents.send("yeconn", "Sunucu Bağlantısı Mevcut.");
            }
 
        }) */

    })



});

const mainmenu = [
    {
        label: "DevTools",
        click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
        },
        accelerator: process.platform == "darwin" ? "Command+N" : "Ctrl+N"
    }
]
