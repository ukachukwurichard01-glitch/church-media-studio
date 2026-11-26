CHURCH MEDIA STUDIO — UPDATE CENTRE INTEGRATION (PREVIEW)

Files in this patch:
- src/App.jsx
- electron/main.cjs
- electron/preload.cjs
- package.json

IMPORTANT:
The GitHub publisher is currently a placeholder:
  ukachukwurichard01-glitch / church-media-studio

Before publishing an installer, replace ukachukwurichard01-glitch with the actual GitHub account that owns the repository. The repository must be public or otherwise accessible to the updater. Publish a GitHub Release with the installer and the electron-builder latest.yml metadata.

This patch adds an Updates Centre to the sidebar and Dashboard, reports the installed app version from Electron, checks GitHub Releases, displays release notes, downloads updates on request, and installs after the user clicks Install and restart.

The updater is only available in packaged Windows builds. The development preview intentionally reports that updates are unavailable. Existing NDI process and frame IPC code is retained.

Version is set to 1.3.1. This patch does not build or publish a Windows installer. Keep all existing public/ files, native/ files, assets, and other project files.
