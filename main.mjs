import { app, BrowserWindow, session, clipboard, nativeImage, Menu, MenuItem, dialog } from 'electron';
import { ElectronBlocker } from '@ghostery/adblocker-electron';
import fetch from 'cross-fetch';
import path from 'path';
import fs from 'fs';
import os from 'node:os';
import { url } from 'inspector';
import { exec } from 'child_process';
import { exit } from 'process';

function enableAdblock() {
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
  blocker.enableBlockingInSession(session.defaultSession);
  });
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    icon: './assets/logo.png',
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false
    },
});

function savePageAsPDF() {
  const baseName = 'page';
  const ext = '.pdf';
  const desktopDir = path.join(os.homedir(), 'Desktop');

  function getFilePath(basePath, baseName, ext) {
    let counter = 0;
    let candidate = path.join(basePath, `${baseName}${ext}`);
    while(fs.existsSync(candidate)) {
      counter++;
      candidate = path.join(basePath, `${baseName}(${counter})${ext}`);
    }
    return candidate;
  }
  const pdfPath = getFilePath(desktopDir, baseName, ext);
  win.webContents.printToPDF({}).then(data => {
    fs.writeFile(pdfPath, data, (error) => {
      if (error) throw error;
      console.log(`Wrote PDF successfully to ${pdfPath}`);
      dialog.showMessageBox({
        title: 'Success!',
        type: 'info',
        message: `PDF saved at ${pdfPath}`
      });
    });
  }).catch(error => {
    console.log(`Failed to write PDF to ${pdfPath}: `, error);
    dialog.showMessageBox({
      title: 'Error!',
      type: 'error',
      message: `Failed to save PDF at ${pdfPath}`
    });
  });
}

function copyLink() {
  let link = win.webContents.getURL();
  if(link.match('index.html')) {
    console.log("Cannot copy home page link!");
  }
  else {
    clipboard.writeText(link);
    console.log("Copied link to clipboard!");
  }
}

  // Maximize the window by default
  win.maximize();
  // Load index.html into the new BrowserWindow.
  win.loadFile('index.html');

  // Create home page shortcut
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu: [{
      label: 'Home',
      accelerator: process.platform === 'darwin' ? 'Cmd+H' : 'Ctrl+H',
      click: () => { win.loadFile('index.html') }
    },
    //Create quit shortcut
    {
      label: 'Quit',
      accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
      click: () => { app.quit() }
    }]
  }));

  //Create back shortcut
  menu.append(new MenuItem({
    label: 'Edit',
    submenu: [{
      //Create reload shortcut
      label: 'Reload',
      accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
      click: () => {
        win.webContents.reload();
        console.log('Reloaded current page!');
      }
    },
    {
      label: 'Back',
      accelerator: process.platform === 'darwin' ? 'Cmd+B' : 'Ctrl+B',
      click: () => {
        if (win.webContents.canGoBack()){
          win.webContents.goBack();
          console.log('Went back!');
        }
      }
  //Create forward shortcut
    },
  {
    label: 'Forward',
    accelerator: process.platform === 'darwin' ? 'Cmd+F' : 'Ctrl+F',
    click: () => {
      if (win.webContents.canGoForward()){
        win.webContents.goForward();
        console.log('Went forward!')
      }
    }
  //Create copy link shortcut
  },
  {
    label: 'Copy link',
    accelerator: process.platform === 'darwin' ? 'Cmd+Shift+C' : 'Ctrl+Shift+C',
    click: () => {
      copyLink();
    }
  //Create copy window as image shortcut
  },
  {
    label: 'Copy as picture',
    accelerator: process.platform === 'darwin' ? 'Cmd+Shift+P' : 'Ctrl+Shift+P',
    click: () => {
      win.webContents.capturePage().then(image => {
        clipboard.writeImage(image);
        console.log("Copied current page as a png image!");
      });
    }
  }]
  }));
  //Create view category
  menu.append(new MenuItem({
    label: 'View',
    submenu: [
    // Create print shortcut
    {
      label: 'Print page to PDF',
      //accelerator: process.platform === 'darwin' ? 'Cmd+P' : 'Ctrl+P',
      click: () => {
        savePageAsPDF();
      }
    }]
  }));
  //Create inspect element shortcut
  menu.append(new MenuItem({
    label: 'Tools',
    submenu: [{
      label: 'Inspect',
      accelerator: process.platform === 'darwin' ? 'Cmd+I' : 'Ctrl+I',
      click: () => {
        win.webContents.openDevTools({mode: 'right'});
        console.log('Opened inspect pannel');
      }
    }]
  }));

  Menu.setApplicationMenu(menu);

  win.setFullScreenable(false);
}

app.whenReady().then(async () => {
  enableAdblock();
  createWindow();
});

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