const { app, BrowserWindow, Menu, MenuItem } = require('electron');

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