import { app, BrowserWindow, screen, Menu, Tray, nativeImage, autoUpdater, dialog } from 'electron';
import * as path from 'path';
import * as Store from 'electron-store';
import * as isDev from 'electron-is-dev';

let win, winSettings, serve, tray, height, offsetX, offsetY, alwaysOnTop;
const args = process.argv.slice(1);

/* AutoUpdate */
const server = 'https://cryptobar.herokuapp.com';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

if (!isDev) {
  autoUpdater.setFeedURL(feed);
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60000);
}

serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')( __dirname, {} );
}

const store = new Store();

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  height = 40;
  offsetX = ( store.get('config.offsetX') ) ? store.get('config.offsetX') : 0;
  offsetY = ( store.get('config.offsetY') ) ? store.get('config.offsetY') : size.height - 40;
  alwaysOnTop = ( store.get('config.alwaysOnTop') ? store.get('config.alwaysOnTop') : false );

  win = new BrowserWindow({
    title: 'CryptoBar',
    icon: 'src/favicon.ico',
    frame: false,
    x: offsetX,
    y: offsetY,

    width: size.width,

    height: height,
    maximizable: false,

    skipTaskbar: true,

    alwaysOnTop: alwaysOnTop,

    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadURL('file://' + __dirname + '/index.html');

  win.on('closed', () => {
    win = null;
  });

  win.on('move', () => {
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
    { label: 'Always on top', type: 'checkbox', checked: alwaysOnTop, click: () => {
      alwaysOnTop = !win.isAlwaysOnTop();

      win.setAlwaysOnTop( alwaysOnTop );
      store.set( 'config.alwaysOnTop', alwaysOnTop );
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

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'CryptoBar Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
});

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})
