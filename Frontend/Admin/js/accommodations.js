/* accommodationAdmin.js
   —————————— */

const ACCOMMODATIONS_PER_PAGE = 6;
let accommodationCurrentPage   = 1;

const accommodationApi = '/api/accommodations';

const accommodationsTable      = document.querySelector('#accommodationsTable tbody');
const addAccommodationBtn      = document.getElementById('addAccommodationBtn');
const accommodationSearch      = document.getElementById('accommodationSearch');
const accommodationsPagination = document.getElementById('accommodationsPagination');

// ---------------- event listeners
addAccommodationBtn.addEventListener('click', showAddAccommodationForm);
accommodationSearch.addEventListener('input', searchAccommodations);
accommodationsPagination.addEventListener('click', handleAccommodationPagination);

// ---------------- initial load
fetchAccommodations();

/* ===== fetch & render ===== */
async function fetchAccommodations () {
  try {
    const res  = await fetch(accommodationApi);
    const data = await res.json();
    renderAccommodationsTable(data);
    renderAccommodationPagination(data.length);
  } catch (err) { console.error('fetch accommodations error', err); }
}

function renderAccommodationsTable (data) {
  accommodationsTable.innerHTML = '';
  const start = (accommodationCurrentPage-1)*ACCOMMODATIONS_PER_PAGE;
  const end   = start + ACCOMMODATIONS_PER_PAGE;
  data.slice(start,end).forEach(acc=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${acc.accommodation_id}</td>
      <td>${acc.name}</td>
      <td>${acc.location}</td>
      <td>${acc.city}</td>
       
      <td>${acc.price_weekly}</td>
      <td>${acc.price_monthly}</td>
      <td>${acc.available ? 'Yes':'No'}</td>
      <td>
        <button class="action-btn edit"   data-id="${acc.accommodation_id}" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="action-btn delete" data-id="${acc.accommodation_id}" title="Delete"><i class="fas fa-trash"></i></button>
      </td>`;
    tr.querySelector('.edit').onclick = ()=> showEditAccommodationForm(acc.accommodation_id);
    tr.querySelector('.delete').onclick = ()=> deleteAccommodation(acc.accommodation_id);
    accommodationsTable.appendChild(tr);
  });
}

function renderAccommodationPagination (total) {
  const pages = Math.ceil(total/ACCOMMODATIONS_PER_PAGE);
  accommodationsPagination.innerHTML='';
  for(let i=1; i<=pages; i++){
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'page-btn';
    if(i === accommodationCurrentPage) btn.classList.add('active');
    btn.onclick = () => { 
      accommodationCurrentPage = i; 
      fetchAccommodations(); 
    };
    accommodationsPagination.appendChild(btn);
  }
}

/* ===== search & pagination helpers ===== */
function handleAccommodationPagination(e){
  if(e.target.classList.contains('page-btn')){
    accommodationCurrentPage = Number(e.target.textContent);
    fetchAccommodations();
  }
}

function searchAccommodations(){
  const q = accommodationSearch.value.toLowerCase();
  accommodationsTable.querySelectorAll('tr').forEach(row=>{
    const name = row.cells[1].textContent.toLowerCase();
    const loc  = row.cells[2].textContent.toLowerCase();
    row.style.display = (name.includes(q) || loc.includes(q)) ? '' : 'none';
  });
}

/* ===== add / edit ===== */
function showAddAccommodationForm(){ 
  showModal('Add Accommodation', createAccommodationForm()); 
}

async function showEditAccommodationForm(id){
  try{
    const res = await fetch(`${accommodationApi}/${id}`);
    if(!res.ok) throw new Error('Record not found');
    const acc = await res.json();
    showModal('Edit Accommodation', createAccommodationForm(acc), acc.accommodation_id);
  }catch(err){ 
    showNotification('Error loading record','error'); 
  }
}

function createAccommodationForm(acc = {}) {
  const form = document.createElement('form');
  form.innerHTML = `
    <label>Name</label>
    <input type="text" name="name" value="${acc.name || ''}" required>

    <label>Location</label>
    <input type="text" name="location" value="${acc.location || ''}" required>

    <label>City</label>
    <input type="text" name="city" value="${acc.city || ''}" required>

    <label>Accommodation type</label>
    <input type="text" name="type" value="${acc.type || ''}" required>

    <label>Rating</label>
    <input type="number" name="rating" value="${acc.rating || ''}" step="0.1">

    <label>Price Weekly (€)</label>
    <input type="number" name="price_weekly" value="${acc.price_weekly || ''}" required>

    <label>Price Monthly (€)</label>
    <input type="number" name="price_monthly" value="${acc.price_monthly || ''}" required>

    <label>Available</label>
    <select name="available">
      <option value="true" ${acc.available ? 'selected' : ''}>Yes</option>
      <option value="false" ${acc.available === false ? 'selected' : ''}>No</option>
    </select>

    <label>Image</label>
    <input type="file" name="image" accept="image/*">

    <br><button type="submit" class="btn primary">${acc.accommodation_id ? 'Update' : 'Add'} Accommodation</button>
  `;

  /* -------- submit handler -------- */
  form.onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(form);

  // available ko boolean string se convert karo
  const availBool = fd.get('available') === 'true';
  fd.set('available', availBool);

  const method = acc.accommodation_id ? 'PUT' : 'POST';
  const url    = acc.accommodation_id ? `${accommodationApi}/${acc.accommodation_id}` : accommodationApi;

  try {
    const res = await fetch(url, { method, body: fd }); // no Content-Type header
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Server error');

    alert(json.message || 'Accommodation added successfully!');
    closeModal();
    fetchAccommodations();
  } catch (err) {
    alert('Error: ' + err.message);
  }
};


  return form;
}

/* ===== delete ===== */
async function deleteAccommodation(id){
  if(!confirm('Delete this accommodation?')) return;
  try{
    const res = await fetch(`${accommodationApi}/${id}`, { method: 'DELETE' });
    const j = await res.json();
    if(!res.ok) throw new Error(j.message || 'Failed to delete');
    showNotification(j.message, 'success');
    fetchAccommodations();
  } catch(err) {
    showNotification(err.message, 'error');
  }
}

/* ===== util ===== */
function showNotification(msg, type) {
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

// --- simple modal helper ---
function showModal(title, content) {
  const overlay = document.createElement('div');
  overlay.className = 'modal';
  overlay.innerHTML = `
    <div class="modal-box">
      <span class="modal-close">&times;</span>
      <h2>${title}</h2>
    </div>`;
  overlay.querySelector('.modal-box').appendChild(content);
  overlay.onclick = e => {
    if(e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) overlay.remove();
  };
  document.body.appendChild(overlay);
}

function closeModal(){
  const modal = document.querySelector('.modal');
  if(modal) modal.remove();
}
