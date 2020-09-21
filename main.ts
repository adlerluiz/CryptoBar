import { app, BrowserWindow, screen, Menu, Tray, nativeImage } from 'electron';
import * as path from 'path';
import * as Store from 'electron-store';
import * as isDev from 'electron-is-dev';

let win, winSettings, serve, tray, _width, _height, _offsetX, _offsetY, _alwaysOnTop;
const args = process.argv.slice(1);

serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {});
}

const store = new Store();

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  _width = (store.get('window-size').width) ? store.get('window-size').width : size.width;
  _height = (store.get('window-size').height) ? store.get('window-size').height : 40;

  _offsetX = (store.get('window-position').x) ? store.get('window-position').x : 0;
  _offsetY = (store.get('window-position').y) ? store.get('window-position').y : size.height - _height;
  _alwaysOnTop = (store.get('always-top') ? store.get('always-top') : false);

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

    resizable: true,

    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadURL('file://' + __dirname + '/index.html');

  win.on('closed', () => {
    win = null;
  });

  let storePositionTimer

  win.on('move', () => {
    let position = win.getPosition()
    if (storePositionTimer) {
      clearTimeout(storePositionTimer)
    }
    storePositionTimer = setTimeout(() => {
      store.set('window-position', {
        x: position[0],
        y: position[1],
      })
    }, 500)
  });

  win.on('resize', function () {
    let windowSize = win.getSize()

    store.set('window-size', {
      width: windowSize[0],
      height: windowSize[1],
    })
  })

  createTray();
}

function createTray() {
  const trayIcon = path.join(__dirname, 'favicon.ico');
  const nimage = nativeImage.createFromPath(trayIcon);

  tray = new Tray(nimage);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Settings', type: 'normal', click: () => { openSettings() } },
    {
      label: 'Always on top', type: 'checkbox', checked: _alwaysOnTop, click: () => {
        _alwaysOnTop = !win.isAlwaysOnTop();

        win.setAlwaysOnTop(_alwaysOnTop);
        store.set('always-top', _alwaysOnTop);
      }
    },
    { type: 'separator' },
    {
      label: 'Exit', type: 'normal', click: () => {
        app.quit()
      }
    }
  ]);
  tray.setToolTip('CryptoBar');
  tray.setContextMenu(contextMenu);

  win.show();
  // win.webContents.openDevTools();

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
    height: 618
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
