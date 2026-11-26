CHURCH MEDIA STUDIO - WORKSPACE UPDATE 1.3.0

Included:
- src/App.jsx
- src/style.css

Improvements:
1. Hymn library has a direct hymn selector in addition to the number-jump field.
2. You can jump directly to any verse/chorus section in the selected hymn.
3. When a hymn is live, changing the selected hymn or section keeps the live NDI/OBS program synchronized.
4. NDI slide rendering now preserves line breaks in hymn lyrics and announcement text rather than flattening everything into one paragraph.
5. Presentation slides can be edited and moved up/down in the presentation order.
6. Announcements can be edited after saving.
7. Existing localStorage data keys are preserved. No native NDI sender files are included or changed.

INSTALLATION:
1. Close Church Media Studio.
2. Extract this ZIP into the CHURCH-MEDIA-STUDIO project folder.
3. Allow replacement of src/App.jsx and src/style.css.
4. Keep your existing public folder, including public/backgrounds and public/data.
5. Run: npm.cmd run build
6. Start Vite and Electron using your normal two-window method.

IMPORTANT:
- Do not delete or replace native/build/Release/ndi_sender.exe or other native NDI files.
- Test the NDI output in OBS before building the Windows installer.
