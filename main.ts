import { app, BrowserWindow, screen, Menu, Tray, nativeImage } from 'electron';
import * as path from 'path';

let win, winSettings, serve, tray;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')( __dirname, {} );
}

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    title: 'CryptoBar',
    icon: 'src/favicon.ico',
    frame: false,
    x: 0,
    y: size.height - 40,

    width: size.width,
    minWidth: 1000,

    height: 38,
    minHeight: 38,
    maxHeight: 39,

    resizable: true,
    maximizable: false,

    skipTaskbar: true,

    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadURL('file://' + __dirname + '/index.html');

  win.on('closed', () => {
    win = null;
  });

  createTray();
}

function createTray() {
  const trayIcon = path.join(__dirname, 'favicon.ico');
  const nimage = nativeImage.createFromPath(trayIcon);

  tray = new Tray( nimage );
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Settings', type: 'normal', click: () => { openSettings() } },
    { label: 'Always on top', type: 'checkbox', click: () => {
      win.setAlwaysOnTop( !win.isAlwaysOnTop() )
    } },
    { type: 'separator' },
    { label: 'Exit', type: 'normal', click: () => { app.quit() } }
  ]);
  tray.setToolTip( 'CryptoBar' );
  tray.setContextMenu( contextMenu );

  win.show();

  tray.on('click', () => {
    win.show();
  })
}

function openSettings() {
  winSettings = new BrowserWindow({
    frame: false,
    maximizable: false,

    title: 'CryptoBar - Settings',
    icon: 'src/favicon.ico',

    width: 400,
    height: 570
  });

  winSettings.loadURL('file://' + __dirname + '/index.html#/settings');

  winSettings.on('closed', () => {
    winSettings = null;
  });
}

try {
  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

  app.on('browser-window-created', (e, window) => {
    window.setMenu(null);
    //window.webContents.openDevTools()
  });

} catch (e) {
  // Catch Error
  // throw e;
}
