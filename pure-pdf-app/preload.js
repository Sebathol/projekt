const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openPDF: () => ipcRenderer.invoke('open-pdf'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // Listeners
  onLoadPDF: (callback) => {
    ipcRenderer.on('load-pdf', (event, pdfBuffer) => callback(pdfBuffer));
  },
  onClosePDF: (callback) => {
    ipcRenderer.on('close-pdf', () => callback());
  },
  onZoomIn: (callback) => {
    ipcRenderer.on('zoom-in', () => callback());
  },
  onZoomOut: (callback) => {
    ipcRenderer.on('zoom-out', () => callback());
  },
  onZoomReset: (callback) => {
    ipcRenderer.on('zoom-reset', () => callback());
  }
});
