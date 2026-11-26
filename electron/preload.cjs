const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("churchStudio", {
  getAppInfo: () => ipcRenderer.invoke("app:info"),
  checkForUpdates: () => ipcRenderer.invoke("updates:check"),
  downloadUpdate: () => ipcRenderer.invoke("updates:download"),
  installUpdate: () => ipcRenderer.invoke("updates:install"),
  onUpdateStatus: (callback) => {
    const listener = (_event, message) => callback(message);
    ipcRenderer.on("updates:status", listener);
    return () => ipcRenderer.removeListener("updates:status", listener);
  },
  startNdi: () => ipcRenderer.invoke("ndi:start"),
  stopNdi: () => ipcRenderer.invoke("ndi:stop"),
  sendNdiFrame: (frame) => ipcRenderer.invoke("ndi:frame", frame),
  onNdiStatus: (callback) => {
    const listener = (_event, message) => callback(message);
    ipcRenderer.on("ndi:status", listener);
    return () => ipcRenderer.removeListener("ndi:status", listener);
  }
});
