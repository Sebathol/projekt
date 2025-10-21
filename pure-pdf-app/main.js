const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let currentFilePath = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Pure PDF Viewer',
    backgroundColor: '#2c3e50'
  });

  mainWindow.loadFile('index.html');

  // Create menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open PDF',
          accelerator: 'CmdOrCtrl+O',
          click: () => openPDFDialog()
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            currentFilePath = null;
            mainWindow.webContents.send('close-pdf');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => mainWindow.webContents.send('zoom-in')
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => mainWindow.webContents.send('zoom-out')
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow.webContents.send('zoom-reset')
        },
        { type: 'separator' },
        {
          label: 'Toggle Fullscreen',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Pure PDF Viewer',
              message: 'Pure PDF Viewer v1.0.0',
              detail: 'A simple and elegant PDF viewer application.\n\nCopyright © 2025 Your Company'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function openPDFDialog() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    loadPDF(filePath);
  }
}

function loadPDF(filePath) {
  try {
    const pdfData = fs.readFileSync(filePath);
    const pdfBuffer = Buffer.from(pdfData).toString('base64');

    currentFilePath = filePath;
    mainWindow.setTitle(`Pure PDF Viewer - ${path.basename(filePath)}`);
    mainWindow.webContents.send('load-pdf', pdfBuffer);
  } catch (error) {
    dialog.showErrorBox('Error', `Failed to load PDF: ${error.message}`);
  }
}

// IPC handlers
ipcMain.handle('open-pdf', async () => {
  await openPDFDialog();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Handle file opening (for double-click on PDF file)
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (mainWindow) {
    loadPDF(filePath);
  } else {
    app.on('ready', () => loadPDF(filePath));
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
