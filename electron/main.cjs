const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

let ndiProcess = null;
let ndiReady = false;
let ndiStartPromise = null;
let ndiFrameWritePromise = Promise.resolve();
const FRAME_BYTES = 960 * 540 * 4;

function ndiPaths() {
  if (app.isPackaged) {
    const dir = path.join(process.resourcesPath, "ndi");
    return { exe: path.join(dir, "ndi_sender.exe"), dllDirs: [dir] };
  }
  const releaseDir = path.join(__dirname, "..", "native", "build", "Release");
  return {
    exe: path.join(releaseDir, "ndi_sender.exe"),
    dllDirs: [releaseDir, path.join(__dirname, "..", "native", "bin"),
      "C:\\Program Files\\NDI\\NDI 6 SDK\\Bin\\x64",
      "C:\\Program Files\\NDI\\NDI 6 Runtime\\v6"]
  };
}

function sendNdiStatus(message) {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send("ndi:status", message);
  }
}

function stopNdiProcess() {
  const child = ndiProcess;
  ndiProcess = null;
  ndiReady = false;
  ndiStartPromise = null;
  if (!child) return;
  try {
    if (child.stdin && !child.stdin.destroyed && child.stdin.writable) child.stdin.end();
  } catch (_) {}
  const killTimer = setTimeout(() => {
    try { if (child.exitCode === null && !child.killed) child.kill(); } catch (_) {}
  }, 1200);
  killTimer.unref?.();
  child.once("close", () => clearTimeout(killTimer));
}

ipcMain.handle("ndi:start", async () => {
  if (process.platform !== "win32") {
    const message = "NDI output is not yet available in this macOS build. The current NDI sender uses the Windows NDI runtime.";
    sendNdiStatus({ type: "error", text: message });
    return { ok: false, error: message };
  }
  if (ndiReady && ndiProcess && ndiProcess.exitCode === null) {
    return { ok: true, ready: true, alreadyRunning: true };
  }
  if (ndiStartPromise) return ndiStartPromise;

  ndiStartPromise = new Promise((resolve) => {
    const paths = ndiPaths();
    if (!fs.existsSync(paths.exe)) {
      ndiStartPromise = null;
      resolve({ ok: false, error: "NDI sender executable not found: " + paths.exe + ". Run npm.cmd run build:ndi." });
      return;
    }

    const dllDirs = paths.dllDirs.filter(dir => fs.existsSync(dir));
    const dllPath = dllDirs.join(path.delimiter);
    const child = spawn(paths.exe, [], {
      cwd: path.dirname(paths.exe),
      env: { ...process.env, PATH: dllPath + path.delimiter + (process.env.PATH || "") },
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true
    });
    ndiProcess = child;
    ndiReady = false;
    let settled = false;
    let stdoutBuffer = "";
    let stderrBuffer = "";
    const readyTimer = setTimeout(() => {
      if (settled) return;
      settled = true;
      sendNdiStatus({ type: "error", text: "NDI sender did not report READY within 12 seconds. " + (stderrBuffer || "Check NDI 6 Runtime and the sender DLL.") });
      stopNdiProcess();
      resolve({ ok: false, error: "NDI sender did not become ready. " + (stderrBuffer || "Check NDI 6 Runtime and DLL files.") });
      ndiStartPromise = null;
    }, 12000);

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", chunk => {
      stdoutBuffer += chunk;
      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() || "";
      for (const line of lines.filter(Boolean)) {
        if (line.startsWith("READY:")) {
          ndiReady = true;
          sendNdiStatus({ type: "ready", text: line });
          if (!settled) {
            settled = true;
            clearTimeout(readyTimer);
            resolve({ ok: true, ready: true });
          }
        } else {
          sendNdiStatus({ type: "status", text: line });
        }
      }
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", chunk => {
      stderrBuffer = (stderrBuffer + chunk).slice(-4000);
      sendNdiStatus({ type: "error", text: chunk.trim() });
    });

    child.stdin.on("error", error => {
      ndiReady = false;
      sendNdiStatus({ type: "error", text: "NDI input pipe error: " + error.message });
    });

    child.on("error", error => {
      ndiReady = false;
      if (ndiProcess === child) ndiProcess = null;
      clearTimeout(readyTimer);
      const message = "Could not launch NDI sender: " + error.message;
      sendNdiStatus({ type: "error", text: message });
      if (!settled) {
        settled = true;
        resolve({ ok: false, error: message });
      }
      ndiStartPromise = null;
    });

    child.on("close", (code, signal) => {
      ndiReady = false;
      if (ndiProcess === child) ndiProcess = null;
      const detail = `NDI sender exited (code ${code}, signal ${signal || "none"})`;
      sendNdiStatus({ type: "stopped", text: detail + (stderrBuffer ? " · " + stderrBuffer.trim() : "") });
      if (!settled) {
        settled = true;
        clearTimeout(readyTimer);
        resolve({ ok: false, error: detail + (stderrBuffer ? ": " + stderrBuffer.trim() : "") });
      }
      ndiStartPromise = null;
    });
  });

  return ndiStartPromise;
});

ipcMain.handle("ndi:stop", async () => {
  stopNdiProcess();
  sendNdiStatus({ type: "stopped", text: "NDI sender stopped by user." });
  return { ok: true };
});

ipcMain.handle("ndi:frame", async (_event, frameData) => {
  const child = ndiProcess;
  if (!child || child.exitCode !== null || child.killed || !ndiReady ||
      !child.stdin || child.stdin.destroyed || !child.stdin.writable) {
    return { ok: false, error: "NDI sender is not ready." };
  }

  let buffer;
  try { buffer = Buffer.from(frameData); }
  catch (error) { return { ok: false, error: "Invalid NDI frame data: " + error.message }; }

  if (buffer.length !== FRAME_BYTES) {
    return { ok: false, error: "Invalid NDI frame size: " + buffer.length + "; expected " + FRAME_BYTES };
  }

  // Serialize complete frame writes to prevent overlapping pipe transfers.
  const writeTask = ndiFrameWritePromise.then(() => new Promise((resolve) => {
    if (ndiProcess !== child || !ndiReady || child.stdin.destroyed || !child.stdin.writable) {
      resolve({ ok: false, error: "NDI sender stopped before the frame could be written." });
      return;
    }
    try {
      child.stdin.write(buffer, (error) => {
        if (error) {
          ndiReady = false;
          const message = "NDI frame pipe write failed: " + error.message;
          sendNdiStatus({ type: "error", text: message });
          resolve({ ok: false, error: message });
        } else {
          resolve({ ok: true });
        }
      });
    } catch (error) {
      ndiReady = false;
      const message = "Could not write NDI frame: " + error.message;
      sendNdiStatus({ type: "error", text: message });
      resolve({ ok: false, error: message });
    }
  }));
  ndiFrameWritePromise = writeTask.then(() => undefined, () => undefined);
  return writeTask;
});

// GitHub Releases updater. The repository owner/name are configured in package.json.
let autoUpdater = null;
try {
  ({ autoUpdater } = require("electron-updater"));
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;

  const sendUpdateStatus = (message) => {
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) win.webContents.send("updates:status", message);
    }
  };
  autoUpdater.on("checking-for-update", () => sendUpdateStatus({ type: "checking" }));
  autoUpdater.on("update-available", info => sendUpdateStatus({ type: "available", info: {
    version: info.version, releaseNotes: info.releaseNotes || ""
  }}));
  autoUpdater.on("update-not-available", () => sendUpdateStatus({ type: "not-available" }));
  autoUpdater.on("download-progress", progress => sendUpdateStatus({ type: "progress", percent: progress.percent }));
  autoUpdater.on("update-downloaded", info => sendUpdateStatus({ type: "downloaded", info: {
    version: info.version, releaseNotes: info.releaseNotes || ""
  }}));
  autoUpdater.on("error", error => sendUpdateStatus({ type: "error", text: error?.message || "Updater error." }));
} catch (error) {
  console.error("Church Media Studio updater could not load:", error);
}

ipcMain.handle("app:info", () => ({
  name: "Church Media Studio",
  version: app.getVersion(),
  platform: process.platform,
  isPackaged: app.isPackaged
}));

ipcMain.handle("updates:check", async () => {
  if (!app.isPackaged) return { ok: false, error: "Update checks are available in the installed Windows application, not the development preview." };
  if (!autoUpdater) return { ok: false, error: "The update module is missing. Install dependencies and rebuild the application." };
  try {
    await autoUpdater.checkForUpdates();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.message || "Could not check GitHub Releases." };
  }
});

ipcMain.handle("updates:download", async () => {
  if (!app.isPackaged || !autoUpdater) return { ok: false, error: "The updater is not available in this build." };
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.message || "Could not download the update." };
  }
});

ipcMain.handle("updates:install", () => {
  if (!app.isPackaged || !autoUpdater) return { ok: false, error: "The updater is not available in this build." };
  autoUpdater.quitAndInstall(false, true);
  return { ok: true };
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1500, height: 950, minWidth: 1100, minHeight: 700,
    backgroundColor: "#080a10", title: "Church Media Studio",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  });
  if (process.env.NODE_ENV === "development" || !app.isPackaged) {
    win.loadURL("http://127.0.0.1:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("before-quit", stopNdiProcess);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
