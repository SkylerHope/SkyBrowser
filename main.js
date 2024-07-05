const { app, BrowserWindow, Menu, MenuItem, session, clipboard, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { url } = require('inspector');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './assets/logo.png',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load index.html into the new BrowserWindow.
  win.loadFile('index.html');

  // Create ad blocker
  fs.readFile(path.join(__dirname, './blocklists/adlist.txt'), 'utf-8', (err, data) => {
    if (err) {
      console.error('Failed to load ad blocking list: ', err);
      return;
    }

    const adPatterns = new Set(
      data.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '' && !line.startsWith('!') && !line.startsWith('#'))
        .map(line => {
          if (line.startsWith('||')) {
            return `*.${line.substring(2).replace('^', '').replace(/[^\w\-\.]/g, '')}`;
          } else if (line.startsWith('|')) {
            return `${line.substring(1).replace('^', '').replace(/[^\w\-\.]/g, '')}`;
          } else if (line.endsWith('^')) {
            return `${line.replace('^', '').replace(/[^\w\-\.]/g, '')}`;
          } else {
            return `${line.replace(/[^\w\-\.]/g, '')}`;
          }
        })
    );

    session.defaultSession.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
      const url = new URL(details.url);
      const hostname = url.hostname;
      
      const shouldBlock = Array.from(adPatterns).some(pattern => {
        return hostname.includes(pattern);
      });

      if (shouldBlock) {
        console.log('Blocked:', details.url);
        callback({ cancel: true });
      } else {
        callback({ cancel: false });
      }
    });
  });

  // Create home page shortcut
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu: [{
      label: 'Home',
      accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
      click: () => { win.loadFile('index.html') }
    }]
  }));

  //Create back shortcut
  menu.append(new MenuItem({
    label: 'Edit',
    submenu: [{
      label: 'Back',
      accelerator: process.platform === 'darwin' ? 'Cmd+K' : 'Ctrl+K',
      click: () => {
        if (win.webContents.canGoBack()){
          win.webContents.goBack();
        }
      }
  //Create forward shortcut
    },
  {
    label: 'Forward',
    accelerator: process.platform === 'darwin' ? 'Cmd+L' : 'Ctrl+L',
    click: () => {
      if (win.webContents.canGoForward()){
        win.webContents.goForward();
      }
    }
  //Create copy link shortcut
  },
  {
    label: 'Copy link',
    accelerator: process.platform === 'darwin' ? 'Cmd+Shift+C' : 'Ctrl+Shift+C',
    click: () => {
      let link = win.webContents.getURL();
      switch (true) {
        case link.endsWith('index.html'):
          link = "";
          console.log("Cannot copy home page link!");
          break;
        default:
          clipboard.writeText(link);
      }
    }
  //Create copy window as image shortcut
  },
  {
    label: 'Copy as image',
    accelerator: process.platform === 'darwin' ? 'Cmd+Shift+P' : 'Ctrl+Shift+P',
    click: () => {
      win.webContents.capturePage().then(image => {
        clipboard.writeImage(image);
      });
    }
  }]
  }));
  //Create inspect element shortcut
  menu.append(new MenuItem({
    label: 'Tools',
    submenu: [{
      label: 'Inspect',
      accelerator: process.platform === 'darwin' ? 'Cmd+Shift+I' : 'Ctrl+Shift+I',
      click: () => {
        win.webContents.openDevTools({mode: 'right'});
      }
    }]
  }))

  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open until the user explicitly quits.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it is common to re-create a window even after all windows have been closed.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});