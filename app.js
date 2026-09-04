(() => {
  const PAGE_SIZE = 40;
  const $ = (id) => document.getElementById(id);
  const els = {
    search: $('searchInput'), field: $('fieldFilter'), rating: $('ratingFilter'), sort: $('sortSelect'),
    reset: $('resetButton'), emptyReset: $('emptyReset'), body: $('resultsBody'), empty: $('emptyState'),
    count: $('resultCount'), context: $('resultContext'), prev: $('prevPage'), next: $('nextPage'),
    pageInfo: $('pageInfo'), pagination: $('pagination')
  };
  let page = 1;

  const ratingScore = { '4*': 5, '4': 4, '3': 3, '2': 2, '1': 1, '': 0 };
  const escapeHtml = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const normalize = (s='') => String(s).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
  const rankClass = (r) => r === '4*' ? 'rank-4star' : `rank-${r || '1'}`;
  const rankBadge = (r) => r ? `<span class="badge ${rankClass(r)}">${escapeHtml(r)}</span>` : '—';

  const fields = [...new Set(JOURNALS.map(j => j.field).filter(Boolean))].sort();
  fields.forEach(field => {
    const o = document.createElement('option'); o.value = field; o.textContent = field; els.field.appendChild(o);
  });

  function filtered() {
    const q = normalize(els.search.value.trim());
    const field = els.field.value;
    const rating = els.rating.value;
    const terms = q.split(/\s+/).filter(Boolean);
    const rows = JOURNALS.filter(j => {
      if (field && j.field !== field) return false;
      if (rating && j.ajg_2024 !== rating) return false;
      if (!terms.length) return true;
      const haystack = normalize([j.title,j.publisher,j.field,j.print_issn,j.e_issn].join(' '));
      return terms.every(t => haystack.includes(t));
    });
    const mode = els.sort.value;
    rows.sort((a,b) => {
      if (mode === 'title-asc') return a.title.localeCompare(b.title);
      if (mode === 'field-asc') return a.field.localeCompare(b.field) || a.title.localeCompare(b.title);
      return (ratingScore[b.ajg_2024] - ratingScore[a.ajg_2024]) || a.title.localeCompare(b.title);
    });
    return rows;
  }

  function render() {
    const rows = filtered();
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;
    const start = (page - 1) * PAGE_SIZE;
    const shown = rows.slice(start, start + PAGE_SIZE);
    els.count.textContent = `${rows.length.toLocaleString()} ${rows.length === 1 ? 'journal' : 'journals'}`;
    els.context.textContent = rows.length === JOURNALS.length ? 'in the 2024 guide' : `matching your filters · ${JOURNALS.length.toLocaleString()} total`;
    els.empty.hidden = rows.length > 0;
    els.pagination.hidden = rows.length === 0;
    els.prev.disabled = page <= 1;
    els.next.disabled = page >= totalPages;
    els.pageInfo.textContent = `Page ${page} of ${totalPages}`;

    els.body.innerHTML = shown.map(j => {
      const issn = [j.print_issn, j.e_issn].filter(Boolean).join(' / ') || '—';
      const links = [
        j.scopus_url ? `<a class="profile-link" href="${escapeHtml(j.scopus_url)}" target="_blank" rel="noreferrer" title="Scopus profile">S</a>` : '',
        j.wos_url ? `<a class="profile-link" href="${escapeHtml(j.wos_url)}" target="_blank" rel="noreferrer" title="Web of Science profile">W</a>` : ''
      ].filter(Boolean).join('');
      return `<tr>
        <td><div class="journal-title">${escapeHtml(j.title)}</div><div class="subtext">AJG 2018: ${escapeHtml(j.ajg_2018 || '—')} · AJG 2015: ${escapeHtml(j.ajg_2015 || '—')}</div></td>
        <td>${escapeHtml(j.field || '—')}</td>
        <td>${escapeHtml(j.publisher || '—')}</td>
        <td class="center">${rankBadge(j.ajg_2024)}</td>
        <td class="center historical">${rankBadge(j.ajg_2021)}</td>
        <td>${escapeHtml(issn)}</td>
        <td class="center"><span class="link-group">${links || '—'}</span></td>
      </tr>`;
    }).join('');
  }

  function reset() {
    els.search.value = ''; els.field.value = ''; els.rating.value = ''; els.sort.value = 'rating-desc'; page = 1; render(); els.search.focus();
  }

  ['input','change'].forEach(evt => els.search.addEventListener(evt, () => { page = 1; render(); }));
  [els.field, els.rating, els.sort].forEach(el => el.addEventListener('change', () => { page = 1; render(); }));
  els.reset.addEventListener('click', reset);
  els.emptyReset.addEventListener('click', reset);
  els.prev.addEventListener('click', () => { page--; render(); window.scrollTo({top: document.querySelector('.results-section').offsetTop - 80, behavior:'smooth'}); });
  els.next.addEventListener('click', () => { page++; render(); window.scrollTo({top: document.querySelector('.results-section').offsetTop - 80, behavior:'smooth'}); });
  document.addEventListener('keydown', e => { if (e.key === '/' && document.activeElement !== els.search) { e.preventDefault(); els.search.focus(); } });

  render();
})();
