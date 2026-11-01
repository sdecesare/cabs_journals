# CABS / AJG 2024 Journal Explorer

Complete static GitHub Pages app.

Files required in the repository root:

- `index.html`
- `styles.css`
- `app.js`
- `data.js`
- `CABS-AJG-2024.csv`
- `CABS-AJG-2024.xlsx` (your existing workbook)

Important: delete any old `download.js` file from the repository. This version does not use SheetJS, XLSX, or any external Excel library.

- Search covers journal title, field, print ISSN, electronic ISSN, and publisher.
- Results show field, journal title, print/online ISSNs, publisher, both AJG ratings, and the workbook's Scopus and Web of Science profile links. All details remain visible in mobile cards. Profile links open in a new tab; missing values display a dash.
- The explorer loads the local `CABS-AJG-2024.csv`, exported from the bundled workbook.
- **Download CSV** downloads that complete file, including all 48 workbook columns, regardless of active filters or pagination. Original workbook values are preserved, including `5` for elite ratings; the explorer displays these as `4*`.
- **Download Excel** is a plain hyperlink to `CABS-AJG-2024.xlsx` in the same folder.

After replacing the workbook, run `python3 scripts/export_csv.py` and commit both the workbook and refreshed CSV. The export uses Python's standard library; Python is only needed for this maintenance step, never by GitHub Pages or visitors.

Preview locally with `python3 -m http.server 8000`, then open `http://localhost:8000/`.

If GitHub Pages still shows an old version after committing, hard-refresh the browser or open the site in a private/incognito window.
