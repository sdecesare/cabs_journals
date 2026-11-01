// AJG 2024 data loader.
// The app loads a public CSV snapshot at runtime so the repository stays lightweight.
// Source repository: https://github.com/wosaide/wosaide-journal-lists
window.JOURNALS = [];
window.JOURNALS_READY = (async () => {
  const sources = [
    'https://raw.githubusercontent.com/wosaide/wosaide-journal-lists/main/LIST/AJG2024.csv',
    'https://raw.githubusercontent.com/quinfer/journal-lens/main/ajg_2024_ground_truth.csv'
  ];

  let lastError;
  for (const url of sources) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const rows = parseCSV(text);
      const journals = normalizeRows(rows);
      if (journals.length < 1000) throw new Error('Unexpectedly small AJG dataset');
      window.JOURNALS = journals;
      window.JOURNAL_SOURCE_URL = url;
      return journals;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Could not load AJG data');
})();

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows.shift().map(h => h.trim());
  return rows.filter(r => r.some(v => String(v).trim())).map(r => Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])));
}

function normalizeRows(rows) {
  const key = obj => Object.keys(obj).reduce((a,k)=>(a[k.toLowerCase().replace(/[^a-z0-9]/g,'')]=obj[k],a),{});
  const first = (o, names) => { for (const n of names) if (o[n] != null && String(o[n]).trim() !== '') return String(o[n]).trim(); return ''; };
  return rows.map(raw => {
    const o = key(raw);
    let rating = first(o,['ajg2024','rating','ajg','abs','rank']);
    if (rating === '5') rating = '4*';
    if (rating === '4+') rating = '4*';
    return {
      title: first(o,['journaltitle','title','journal','name']),
      field: first(o,['field','subjectfield','category','subject']),
      rating2024: rating,
      rating2021: first(o,['ajg2021','rating2021','abs2021']),
      raw
    };
  }).filter(j => j.title);
}
