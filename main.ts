import { app, BrowserWindow, screen, Menu, Tray, nativeImage } from 'electron';
import * as path from 'path';
import * as Store from 'electron-store';
import * as isDev from 'electron-is-dev';

let win, winSettings, serve, tray, _width, _height, _offsetX, _offsetY, _alwaysOnTop;
const args = process.argv.slice(1);

serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')( __dirname, {} );
}

const store = new Store();

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  _width = ( store.get('config.width') ) ? store.get('config.width') : size.width;
  _height = ( store.get('config.height') ) ? store.get('config.height') : 40;

  _offsetX = ( store.get('config.offsetX') ) ? store.get('config.offsetX') : 0;
  _offsetY = ( store.get('config.offsetY') ) ? store.get('config.offsetY') : size.height - _height;
  _alwaysOnTop = ( store.get('config.alwaysOnTop') ? store.get('config.alwaysOnTop') : false );

  win = new BrowserWindow({
    title: 'CryptoBar',
    icon: 'src/favicon.ico',
    frame: false,
    x: _offsetX,
    y: _offsetY,

    width: _width,

    height: _height,
    maximizable: false,

    skipTaskbar: true,

    alwaysOnTop: _alwaysOnTop,

    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadURL('file://' + __dirname + '/index.html');

  win.on('closed', () => {
    win = null;
  });

  win.on('move', () => {
    store.set( 'config.width', win.getSize()[0] );
    store.set( 'config.height', win.getSize()[1] );
    store.set( 'config.offsetX', win.getPosition()[0] );
    store.set( 'config.offsetY', win.getPosition()[1] );
  });

  createTray();
}

function createTray() {
  const trayIcon = path.join(__dirname, 'favicon.ico');
  const nimage = nativeImage.createFromPath(trayIcon);

  tray = new Tray( nimage );
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Settings', type: 'normal', click: () => { openSettings() } },
    { label: 'Always on top', type: 'checkbox', checked: _alwaysOnTop, click: () => {
      _alwaysOnTop = !win.isAlwaysOnTop();

      win.setAlwaysOnTop( _alwaysOnTop );
      store.set( 'config.alwaysOnTop', _alwaysOnTop );
    } },
    { type: 'separator' },
    { label: 'Exit', type: 'normal', click: () => {
      app.quit()
    } }
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
    height: 582
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
