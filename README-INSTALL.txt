CHURCH MEDIA STUDIO — SETTINGS UPDATE

This adds a working Settings page with:
- Interface text size: Small, Medium, Large
- Show/hide Preview and Program / Live monitors
- Preferred startup page setting (saved for future startup integration)
- Confirm before deleting a song
- Restore defaults

Settings are stored in localStorage on this computer and work offline.

INSTALL
1. Close Church Media Studio.
2. Stop the running terminal with Ctrl+C.
3. Extract this ZIP.
4. Copy the extracted src folder into:
   C:\Users\Gewitter PC\Desktop\CHURCH-MEDIA-STUDIO
5. Allow replacement of src\App.jsx and src\style.css.
6. Keep public\data\kjv.json in place.
7. Run: npm.cmd run dev

This update does not yet create the Windows installer or implement native NDI.
