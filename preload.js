// Context bridge for Electron and Toastify
const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld("axios", {
  openAI: (message) => ipcRenderer.invoke('axios.openAI', message),
  supaBase: (method, id, data) => ipcRenderer.invoke('axios.supaBase', method, id, data)
});

contextBridge.exposeInMainWorld("Toastify", {
  showToast: (options) => Toastify(options).showToast()
});