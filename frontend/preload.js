// preload.ts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendCommand: (command, args) =>
    ipcRenderer.invoke("execute-command", command, args),
});
