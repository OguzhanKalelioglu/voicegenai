// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  speakText: (text, voice) => ipcRenderer.invoke('speak-text', text, voice),
  onReadClipboard: (callback) => ipcRenderer.on('read-clipboard', (event, clipboardText) => callback(clipboardText))
});

// Ek olarak, `read-clipboard` eventini de burada dinleyebilir,
// veya renderer.js'in "plain" şekilde `ipcRenderer.on` kullanmasına
// izin verebilirsin. (Electron sürümüne göre değişebilir.)
