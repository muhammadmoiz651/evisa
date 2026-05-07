// === Study Guides (IELTS) CRUD – plain JS ===
const STUDY_GUIDES_API = '/api/study-guides';

const guidesTableBody = document.querySelector('#guidesTable tbody');
const addGuideBtn     = document.getElementById('addGuideBtn');

/* ---------- FETCH HELPERS ---------- */
const getGuides = () => fetch(STUDY_GUIDES_API).then(r => r.json());
const getGuide  = id => fetch(`${STUDY_GUIDES_API}/${id}`).then(r => r.json());

const createGuide = data => fetch(STUDY_GUIDES_API, {
  method :'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
});

const updateGuide = (id,data) => fetch(`${STUDY_GUIDES_API}/${id}`, {
  method :'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
});

const deleteGuide = id => fetch(`${STUDY_GUIDES_API}/${id}`, { method:'DELETE' });

/* ---------- TABLE RENDER ---------- */
function renderGuidesTable(rows=[]) {
  guidesTableBody.innerHTML = '';
  rows.forEach(g => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${g.id}</td>
      <td>${g.title}</td>
      <td>${(g.description||'').slice(0,100)}</td>
      <td>${g.icon ? (g.icon.startsWith('http') || g.icon.startsWith('data:image') 
               ? `<img src="${g.icon}" class="icon-img">` 
               : `<i class="${g.icon}"></i>`) : ''}</td>
      <td class="pdf-cell"><a href="${g.pdf_file}" target="_blank" rel="noopener">
        <i class="fas fa-file-pdf"></i> View
      </a></td>
      <td>
        <button class="btn small edit" data-id="${g.id}"><i class="fas fa-edit"></i></button>
        <button class="btn small delete" data-id="${g.id}"><i class="fas fa-trash"></i></button>
      </td>`;
    guidesTableBody.appendChild(tr);
  });
}

/* ---------- INITIAL LOAD ---------- */
async function loadGuides() {
  try { renderGuidesTable(await getGuides()); }
  catch(err){ console.error('Load error',err); }
}

/* ---------- MODAL HELPERS ---------- */
function createGuideForm(guide={}) {
  const form = document.createElement('form');
  form.innerHTML = `
  <label>Title</label>
  <input type="text" name="title" value="${guide.title||''}" required>

  <label>Description</label>
  <textarea name="description" rows="3">${guide.description||''}</textarea>

  <!-- REMOVED ICON INPUTS -->

  <label>PDF URL</label>
  <input type="url" name="pdf_file" value="${guide.pdf_file||''}" required>

  <br><br>
  <button type="submit" class="btn primary">${guide.id?'Update':'Add'} Guide</button>`;
  return form;
}


function showModal(title, content) {
  // remove old study‑guide overlay if any
  document.querySelector('.sg-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'sg-overlay';

  const modal = document.createElement('div');
  modal.className = 'sg-modal';
  modal.innerHTML = `<span class="sg-close">&times;</span><h2>${title}</h2>`;
  modal.appendChild(content);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector('.sg-close').onclick = () => overlay.remove();
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
}

/* ---------- ADD ---------- */
addGuideBtn.addEventListener('click', () => {
  const form = createGuideForm();
  showModal('Add IELTS Guide', form);

  form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  // Set default icon manually
  data.icon = 'fas fa-book';  // You can use any default icon class or image URL

  try {
    await createGuide(data);
    showNotification('Guide added','success');
    document.querySelector('.sg-overlay')?.remove();
    loadGuides();
  } catch(err){
    showNotification('Add failed','error');
  }
});


// Helper function to convert file to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

});

/* ---------- EDIT & DELETE ---------- */
guidesTableBody.addEventListener('click', async e => {
  const btnEdit   = e.target.closest('.edit');
  const btnDelete = e.target.closest('.delete');
  if (!btnEdit && !btnDelete) return;

  const id = e.target.closest('button').dataset.id;

  // EDIT
  if (btnEdit) {
    try {
      const guide = await getGuide(id);
      const form  = createGuideForm(guide);
      showModal('Edit IELTS Guide', form);

      form.addEventListener('submit', async ev => {
        ev.preventDefault();
        try{
          await updateGuide(id, Object.fromEntries(new FormData(form)));
          showNotification('Guide updated','success');
          document.querySelector('.sg-overlay')?.remove();
          loadGuides();
        }catch(err){ showNotification('Update failed','error'); }
      });
    } catch(err){ showNotification('Load failed','error'); }
    return;
  }

  // DELETE
  if (btnDelete && confirm('Delete this guide?')) {
    try { await deleteGuide(id); showNotification('Guide deleted','success'); loadGuides(); }
    catch(err){ showNotification('Delete failed','error'); }
  }
});

/* ---------- NOTIFICATION ---------- */
function showNotification(msg,type='info'){
  const n=document.createElement('div');
  n.className=`notification ${type}`; n.textContent=msg;
  document.body.appendChild(n); setTimeout(()=>n.remove(),3000);
}

/* ---------- STYLE INJECTION ---------- */
const css = `
/* study‑guide overlay & modal */
.sg-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.55);
  display:flex;align-items:center;justify-content:center;
  z-index:9999;
}
.sg-modal{
  background:#fff;padding:24px 28px;border-radius:10px;
  max-width:500px;width:90%;
  box-shadow:0 8px 25px rgba(0,0,0,.25);
  animation:sgPop .25s ease;
  position:relative;
}
.sg-close{
  position:absolute;right:14px;top:10px;
  font-size:22px;font-weight:bold;cursor:pointer;
}
@keyframes sgPop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}

/* link cell */
.pdf-cell a{color:black;text-decoration:none;font-weight:500}
.pdf-cell a:hover{text-decoration:underline}

/* toast notifications */
.notification{position:fixed;right:20px;top:20px;padding:10px 16px;border-radius:4px;color:#fff;z-index:9999}
.notification.success{background:#28a745}.notification.error{background:#dc3545}`;
const styleEl=document.createElement('style');styleEl.textContent=css;document.head.appendChild(styleEl);

/* ---------- INIT ---------- */
loadGuides();
