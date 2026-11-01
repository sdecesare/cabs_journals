// Static CSV exported from the bundled CABS-AJG-2024.xlsx workbook.
window.JOURNALS = [];
window.JOURNALS_READY = (async () => {
  const url = './CABS-AJG-2024.csv';
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const journals = normalizeRows(parseCSV(await response.text()));
  if (journals.length < 1000) throw new Error('Unexpectedly small AJG dataset');
  window.JOURNALS = journals;
  window.JOURNAL_SOURCE_URL = url;
  return journals;
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
  return rows.filter(r => r.some(v => String(v).trim())).map(r => Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}

function normalizeRows(rows) {
  const key = obj => Object.keys(obj).reduce((a,k)=>(a[k.toLowerCase().replace(/[^a-z0-9]/g,'')]=obj[k],a),{});
  const first = (o, names) => { for (const n of names) if (o[n] != null && String(o[n]).trim() !== '') return String(o[n]).trim(); return ''; };
  const rating = value => ['5', '4+'].includes(value) ? '4*' : value;
  return rows.map(raw => {
    const o = key(raw);
    return {
      title: first(o,['journaltitle','title','journal','name']),
      field: first(o,['field','subjectfield','category','subject']),
      printIssn: first(o,['printissn','issn']),
      eIssn: first(o,['eissn','electronicissn','onlineissn']),
      publisher: first(o,['publisher']),
      rating2024: rating(first(o,['ajg2024','rating','ajg','abs','rank'])),
      rating2021: rating(first(o,['ajg2021','rating2021','abs2021'])),
      raw
    };
  }).filter(j => j.title);
}
