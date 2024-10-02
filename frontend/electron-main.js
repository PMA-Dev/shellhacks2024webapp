import { app, BrowserWindow } from "electron";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    // Production: load the index.html file
    win.loadFile(path.join(__dirname, "build", "index.html"));
  } else {
    // Development: load from localhost
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
