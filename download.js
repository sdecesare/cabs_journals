(() => {
  const toggle=document.getElementById('downloadToggle'), menu=document.getElementById('downloadOptions');
  const csvBtn=document.getElementById('downloadCsv'), xlsxBtn=document.getElementById('downloadExcel');
  toggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));});
  document.addEventListener('click',e=>{if(!e.target.closest('.download-menu')){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}});

  async function getData(){ return window.APP_JOURNALS || await window.JOURNALS_READY; }
  function exportRows(data){
    const dynamic=[...new Set(data.flatMap(j=>Object.keys(j.raw||{})))];
    if(dynamic.length) return {headers:dynamic, rows:data.map(j=>dynamic.map(h=>j.raw?.[h]??''))};
    return {headers:['Journal Title','Field','AJG 2024','AJG 2021'], rows:data.map(j=>[j.title,j.field,j.rating2024,j.rating2021])};
  }
  function csvEscape(v){const s=String(v??'');return /[",\n\r]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;}
  function saveBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}

  csvBtn.addEventListener('click',async()=>{const {headers,rows}=exportRows(await getData());const csv='\uFEFF'+[headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\r\n');saveBlob(new Blob([csv],{type:'text/csv;charset=utf-8'}),'ABS_AJG_2024_journal_list.csv');menu.hidden=true;});
  xlsxBtn.addEventListener('click',async()=>{const {headers,rows}=exportRows(await getData());if(!window.XLSX){alert('Excel library could not load. Please use the CSV download instead.');return;}const ws=XLSX.utils.aoa_to_sheet([headers,...rows]);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'AJG 2024');XLSX.writeFile(wb,'ABS_AJG_2024_journal_list.xlsx');menu.hidden=true;});
})();
