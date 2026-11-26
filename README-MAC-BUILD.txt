CHURCH MEDIA STUDIO — macOS installer preparation patch
==========================================================

This patch prepares the existing Electron project to build a macOS DMG using
a GitHub-hosted macOS runner. It does NOT contain a finished DMG installer.

FILES TO REPLACE / ADD
----------------------
1. Replace the project's package.json with this package.json.
2. Replace electron/main.cjs with this electron/main.cjs.
3. Add .github/workflows/build-macos.yml at that exact path.

IMPORTANT NDI LIMITATION
------------------------
The uploaded project contains a Windows NDI sender (ndi_sender.exe) and
Processing.NDI.Lib.x64.dll. Those files cannot run on macOS. This patch keeps
them in Windows-only packaging and makes the macOS NDI button report that
NDI output is not yet available. The rest of the Electron/React app can be
packaged for macOS, but Mac NDI needs a separate macOS-native sender and the
appropriate NDI SDK/runtime.

HOW TO GET THE DMG WITHOUT OWNING A MAC
---------------------------------------
1. Push the complete project to the GitHub repository:
   ukachukwurichard01-glitch/church-media-studio
   The repository must contain package.json, package-lock.json (if used),
   electron/, src/, public/ and the other required project files.
2. In GitHub, open the repository's Actions tab.
3. Select "Build Church Media Studio for macOS".
4. Choose "Run workflow".
5. Wait for the workflow to finish successfully.
6. Open the completed workflow run and download the artifact named
   "Church-Media-Studio-macOS-DMG". It contains the .dmg installer.

The workflow uses npm ci, which requires package-lock.json. If the project
does not have package-lock.json, change that workflow step to `npm install`.

SIGNING / GATEKEEPER
--------------------
This DMG is unsigned. macOS may show a security warning when first opened.
For normal public distribution without Gatekeeper warnings, sign and notarize
the app with an Apple Developer ID and Apple's notarization service. That
requires a paid Apple Developer Program membership and signing credentials.

WINDOWS BUILD
-------------
The Windows NDI sender and Windows NSIS configuration remain in place.
Do not run the macOS workflow on Windows itself; GitHub Actions builds it
on a macOS runner.
