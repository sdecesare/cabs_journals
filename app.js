(() => {
  const $ = id => document.getElementById(id);
  const searchInput=$('searchInput'), fieldFilter=$('fieldFilter'), ratingFilter=$('ratingFilter'), sortSelect=$('sortSelect');
  const resetButton=$('resetButton'), resultsBody=$('resultsBody'), resultCount=$('resultCount'), resultContext=$('resultContext');
  const prevPage=$('prevPage'), nextPage=$('nextPage'), pageInfo=$('pageInfo'), emptyState=$('emptyState'), emptyReset=$('emptyReset'), loadError=$('loadError');
  const PAGE_SIZE=30;
  let journals=[], filtered=[], page=1;

  const rankValue = r => ({'4*':5,'4':4,'3':3,'2':2,'1':1}[String(r)] || 0);
  const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const badge = r => r ? `<span class="badge rank-${r==='4*'?'4star':esc(r)}">${esc(r)}</span>` : '—';

  function populateFields(){
    const fields=[...new Set(journals.map(j=>j.field).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    fieldFilter.innerHTML='<option value="">All fields</option>'+fields.map(f=>`<option value="${esc(f)}">${esc(f)}</option>`).join('');
  }
  function applyFilters(resetPage=true){
    if(resetPage) page=1;
    const q=searchInput.value.trim().toLowerCase(), field=fieldFilter.value, rating=ratingFilter.value;
    filtered=journals.filter(j=>(!q || `${j.title} ${j.field} ${j.printIssn} ${j.eIssn} ${j.publisher}`.toLowerCase().includes(q)) && (!field||j.field===field) && (!rating||j.rating2024===rating));
    const sort=sortSelect.value;
    filtered.sort((a,b)=> sort==='title-asc' ? a.title.localeCompare(b.title) : sort==='field-asc' ? (a.field||'').localeCompare(b.field||'') || a.title.localeCompare(b.title) : rankValue(b.rating2024)-rankValue(a.rating2024) || a.title.localeCompare(b.title));
    render();
  }
  function render(){
    const totalPages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE)); page=Math.min(page,totalPages);
    const slice=filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
    resultsBody.innerHTML=slice.map(j=>`<tr><td><div class="journal-title">${esc(j.title)}</div></td><td>${esc(j.field||'—')}</td><td class="center">${badge(j.rating2024)}</td><td class="center historical">${badge(j.rating2021)}</td></tr>`).join('');
    resultCount.textContent=`${filtered.length.toLocaleString()} journal${filtered.length===1?'':'s'}`;
    resultContext.textContent=filtered.length===journals.length?'in the 2024 guide':'matching your filters';
    emptyState.hidden=filtered.length!==0;
    prevPage.disabled=page<=1; nextPage.disabled=page>=totalPages || filtered.length===0; pageInfo.textContent=`Page ${page} of ${totalPages}`;
  }
  function reset(){ searchInput.value='';fieldFilter.value='';ratingFilter.value='';sortSelect.value='rating-desc';applyFilters(); }

  searchInput.addEventListener('input',()=>applyFilters()); fieldFilter.addEventListener('change',()=>applyFilters()); ratingFilter.addEventListener('change',()=>applyFilters()); sortSelect.addEventListener('change',()=>applyFilters());
  resetButton.addEventListener('click',reset); emptyReset.addEventListener('click',reset); prevPage.addEventListener('click',()=>{if(page>1){page--;render();window.scrollTo({top:document.querySelector('.results-section').offsetTop-70,behavior:'smooth'});}}); nextPage.addEventListener('click',()=>{if(page<Math.ceil(filtered.length/PAGE_SIZE)){page++;render();window.scrollTo({top:document.querySelector('.results-section').offsetTop-70,behavior:'smooth'});}});
  document.addEventListener('keydown',e=>{if(e.key==='/' && document.activeElement.tagName!=='INPUT'){e.preventDefault();searchInput.focus();}});

  JOURNALS_READY.then(data=>{journals=data;populateFields();applyFilters();window.APP_JOURNALS=journals;}).catch(err=>{console.error(err);resultCount.textContent='Journal list unavailable';loadError.hidden=false;});
})();
