# Church Media Studio corrections (v1.1.0)

These are complete replacement files for the project, not individual snippets.

## Files included
- `src/App.jsx` — loads the offline 300-hymn Watchman library separately from church-added songs; supports hymn-number/title/lyric search and verse/chorus labels.
- `src/style.css` — current styles plus small hymn layout refinements.
- `electron/main.cjs` — waits for native NDI READY, reports startup/exit diagnostics, guards writes to a closed pipe, and checks complete frames.
- `electron/preload.cjs` — compatible preload bridge.
- `native/ndi_sender.cpp` — reads complete frames even when Windows splits pipe data; converts canvas RGBA pixels to NDI BGRA.
- `package.json` — adds author and packages both the sender executable and NDI DLL.
- `public/data/watchman-hymns.json` — the uploaded 300-hymn JSON file in the required app path.

## Before replacing
1. Close Church Media Studio and stop any running `npm run dev` terminal.
2. Make a backup copy of your whole `CHURCH-MEDIA-STUDIO` folder.
3. Copy the folders/files from this ZIP into the project root and choose **Replace** when Windows asks.
4. Confirm these two native files exist:
   - `native\build\Release\ndi_sender.exe`
   - `native\build\Release\Processing.NDI.Lib.x64.dll`

## Rebuild and test (PowerShell)
Open PowerShell in `C:\Users\Gewitter PC\Desktop\CHURCH-MEDIA-STUDIO`, then run:

```powershell
npm.cmd run build:ndi
npm.cmd run dev
```

Check Hymns first: search for hymn number `3` or title `To God Be The Glory`. It should show the verses and choruses as separate sections.

Then open **NDI & OBS**, click **Start NDI Sender**, and wait until the status says `READY: CHURCH MEDIA STUDIO`. In OBS, add a DistroAV NDI Source and select `CHURCH MEDIA STUDIO`.

## Build the Windows installer
After the development test succeeds:

```powershell
npm.cmd run dist
```

The installer should be created under `release`.

## Important NDI runtime note
The app installer now bundles `ndi_sender.exe` and `Processing.NDI.Lib.x64.dll`. The NDI 6 Runtime may still need to be installed on the Windows computer for the remaining NDI runtime components. Both computers must be on the same local network, and Windows Firewall must allow the app's network traffic.

## Hymn file note
The app reads `public/data/watchman-hymns.json` during the Vite build. The data file is copied into `dist/data` automatically by Vite. The JSON is kept as a separate project data file; it is not embedded into `App.jsx`.
