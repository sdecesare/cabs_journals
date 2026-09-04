# ABS Journal Guide Explorer 2024

A simple, responsive, client-side search interface for the supplied ABS / Academic Journal Guide 2024 journal list.

## Features

- Search by journal title, ISSN/eISSN, publisher, or field
- Filter by field and AJG 2024 rating
- Sort by rating, journal name, or field
- Displays AJG 2024 and historical ratings
- Links to Scopus and Web of Science profiles where supplied
- Responsive table/cards for desktop and mobile
- No backend, database, login, or build step
- Designed for GitHub Pages

## Run locally

You can double-click `index.html`, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a new GitHub repository, for example `abs-journal-explorer`.
2. Upload all files in this folder to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. GitHub will publish the app at a URL similar to `https://YOUR-USERNAME.github.io/abs-journal-explorer/`.

## Updating the data

`data.js` contains the journal records used by the app. Replace/regenerate this file when a newer list is available, keeping the same field names.

## Data note

The interface is independent and is not affiliated with or endorsed by the Chartered Association of Business Schools. The source workbook supplied for this project uses `5` for the highest AJG tier; this interface displays that tier as the familiar `4*` label.
