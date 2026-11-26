CHURCH MEDIA STUDIO - NDI PIPE FIX

Replaces:
  electron/main.cjs
  src/App.jsx
  native/ndi_sender.cpp

Changes:
- Electron serializes NDI frame writes and waits for each write callback.
- The app sends at most one frame at a time instead of overlapping 2 MB transfers.
- Stopping NDI waits for the current frame transfer before closing the pipe.
- The native sender's partial-frame message identifies pipe closure more clearly.

Install:
1. Close Church Media Studio and stop its running terminal.
2. Back up the three existing files.
3. Extract this ZIP into:
   C:\Users\Gewitter PC\Desktop\CHURCH-MEDIA-STUDIO
4. Replace the three files when Windows asks.
5. In PowerShell run:

   cd "$env:USERPROFILE\Desktop\CHURCH-MEDIA-STUDIO"
   npm.cmd run build:ndi
   npm.cmd run dev

6. Open NDI & OBS, click Start NDI Sender, and leave it running for 30 seconds.
7. If it stays ready, test OBS, then test Stop NDI Sender.

If build:ndi reports an error, send the complete error text. Do not build the installer until the development test succeeds.
