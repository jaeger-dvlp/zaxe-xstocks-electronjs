const electron = require('electron');
const url = require('url');
const path = require('path');
const connection = require('./libs/db');
const { catchError, controlConnection } = require('./handlers');

const { app, BrowserWindow, ipcMain, Menu } = electron;

app.on('ready', () => {
  let mwindow = new BrowserWindow({
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
      pathname: path.join(__dirname, 'mwindow.html'),
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

  let win = 0;

  ipcMain.on('lck', () => {
    if (win === 0) {
      mwindow.maximize();
      mwindow.webContents.send('mainup', '');
      win++;
    } else {
      win = 0;
      mwindow.unmaximize();
      mwindow.webContents.send('maindown', '');
    }
  });

  catchError(connection);

  mwindow.webContents.once('dom-ready', () => {
    controlConnection(connection)
      .then((results) => {
        mwindow.webContents.send('init', results);
        mwindow.webContents.send('yeconn', 'Sunucu Bağlantısı Mevcut.');
      })
      .catch((error) => {
        console.log(`Query error: ${error}`);
        mwindow.webContents.send('noconn', 'Sunucu Bağlantısı Yok.');
      });
  });
});
