# ABS / AJG Journal Explorer 2024

Complete static GitHub Pages app.

## Files
- `index.html` – page structure
- `styles.css` – styling
- `data.js` – AJG data loader
- `app.js` – search, filters, sorting and pagination
- `download.js` – full-list CSV / Excel downloads

## Deploy on GitHub Pages
1. Delete/replace the existing files in the repository root with all files from this folder.
2. Commit to `main`.
3. In **Settings → Pages**, choose **Deploy from a branch**, `main`, `/ (root)`.

## Downloads
The **Download ABS/AJG 2024** button exports the complete dataset currently loaded by the app, not just filtered results.

## Data
The app loads a public AJG 2024 CSV snapshot from GitHub at runtime. A fallback public AJG dataset is configured if the primary source is unavailable. Because of this, the site requires internet access (as GitHub Pages normally does).

## Notes
This is an independent interface and is not affiliated with or endorsed by the Chartered Association of Business Schools. Verify important publication decisions against the official AJG source.
