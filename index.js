const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const url = require('url');
const path = require('path');
const dbPool = require('./libs/db');
const { getTableByName } = require('./handlers');

let win = 0;

app.on('ready', () => {
  const mwindow = new BrowserWindow({
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
    title: 'Zaxe Stocks',
    transparent: true,
    icon: path.join(__dirname, 'rsc/logoico.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mwindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'static/mwindow.html'),
      slashes: true,
    })
  );

  const mainmenu = [
    {
      label: 'DevTools',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      },
      accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
    },
  ];
  const devtools = Menu.buildFromTemplate(mainmenu);
  Menu.setApplicationMenu(devtools);

  ipcMain.on('min', () => {
    mwindow.minimize();
  });

  ipcMain.on('ext', () => {
    mwindow.close();
    process.exit();
  });

  ipcMain.on('lck', () => {

    if (win === 0) {
      mwindow.maximize();
      mwindow.webContents.send('mainup', '');
      win += 1;
    } else {
      win = 0;
      mwindow.unmaximize();
      mwindow.webContents.send('maindown', '');
    }

  });

  mwindow.webContents.once('dom-ready', () => {

    getTableByName(dbPool, 'printers')
      .then((results) => {
        mwindow.webContents.send('init', results);
        mwindow.webContents.send('yeconn', 'Sunucu Bağlantısı Mevcut.');
        con = false;
      })
      .catch((err) => {
        console.log(`Query Err: ${err}`);
        mwindow.webContents.send('noconn', 'Sunucu Bağlantısı Yok.');
        con = false;
      });

  });


  ipcMain.on('cnc', () => {

    getTableByName(dbPool, 'printers')
      .then((results) => {
        mwindow.webContents.send('init', results);
        mwindow.webContents.send('yeconn', 'Sunucu Bağlantısı Mevcut.');
      })
      .catch((err) => {
        console.log(`Query Error: ${err}`);
        mwindow.webContents.send('noconn', 'Sunucu Bağlantısı Yok.');
      });

  });
});
