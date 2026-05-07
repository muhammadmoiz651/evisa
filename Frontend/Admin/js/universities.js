// ------------------------------------------------------------
// Helper: Debounce Function
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Helper: Create Pagination Buttons
function createPagination(totalItems, perPage, currentPage, onPageClick) {
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const container = document.createElement('div');
  container.classList.add('pagination');

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.add('page-btn');
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => onPageClick(i));
    container.appendChild(btn);
  }
  return container;
}

// ------------------------------------------------------------
// Modal Form Creation (for Add/Edit)
// Ab add form mein bhi university_id input hoga (text type)
// Aur update form mein hidden input rahega jaisa pehle tha

function createUniversityForm(univ = {}) {
  const modal = document.createElement('div');
  modal.classList.add('modal-overlay');
  Object.assign(modal.style, {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,.6)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 9999
  });

  const box = document.createElement('div');
  box.classList.add('modal-content');
  Object.assign(box.style, {
    background: '#fff', padding: '30px 40px',
    borderRadius: '10px', width: '500px', maxWidth: '90vw',
    boxShadow: '0 4px 15px rgba(0,0,0,.3)', overflowY: 'auto',
    maxHeight: '90vh'
  });

  /* ---------- NEW: country_id field ---------- */
  const countryIdField = univ.country_id
    ? `<input type="hidden" name="country_id" value="${univ.country_id}">`
    : `<label>Country&nbsp;ID:<br>
         <input type="number" name="country_id" required>
       </label>`;

  box.innerHTML = `
    <h2 style="margin-bottom:20px;font-weight:600">
      ${univ.university_id ? 'Update' : 'Add'} University
    </h2>
    <form id="univForm" style="display:flex;flex-direction:column;gap:15px">
      ${univ.university_id
      ? `<input type="hidden" name="university_id" value="${univ.university_id}">`
      : `<label>University&nbsp;ID:<br>
             <input type="number" name="university_id" required>
           </label>`
    }
      ${countryIdField}
      <label>University Name:<br>
        <input type="text" name="university_name"
               value="${univ.university_name ?? ''}" required>
      </label>
      <label>Country Name:<br>
        <input type="text" name="country_name"
               value="${univ.country_name ?? ''}" required>
      </label>
      <!-- the rest of your fields are unchanged -->
      <label>World Ranking:<br>
        <input type="number" name="world_ranking"
               value="${univ.world_ranking ?? ''}">
      </label>
      <label>Top Programs:<br>
        <input type="text" name="top_programs"
               value="${univ.top_programs ?? ''}">
      </label>
      <label>Application Deadlines:<br>
        <input type="text" name="application_deadlines"
               value="${univ.application_deadlines ?? ''}">
      </label>
      <label>Undergraduate Application Link:<br>
        <input type="url" name="undergraduate_application_link"
               value="${univ.undergraduate_application_link ?? ''}">
      </label>
      <label>Masters Application Link:<br>
        <input type="url" name="masters_application_link"
               value="${univ.masters_application_link ?? ''}">
      </label>
      <label>Guidance:<br>
        <textarea name="guidance" rows="3">${univ.guidance ?? ''}</textarea>
      </label>
      <label>Programs (comma separated):<br>
        <input type="text" name="programs"
               value="${Array.isArray(univ.programs)
      ? univ.programs.join(', ')
      : (univ.programs ?? '')}">
      </label>
      <label>Degree:<br>
        <input type="text" name="degree"
               value="${univ.degree ?? ''}">
      </label>
      <label>University Image:<br>
  <input type="file" name="university_image" accept="image/*">
</label>



      <div style="display:flex;justify-content:flex-end;gap:15px;">
  <button type="button" id="cancelBtn" style="background-color:#F4C542; color:#5D1049; border:none; padding:8px 16px; border-radius:5px;">Cancel</button>
  <button type="submit" style="background-color:#5D1049; color:white; border:none; padding:8px 16px; border-radius:5px;">
    ${univ.university_id ? 'Update' : 'Add'}
  </button>
</div>

    </form>`;
  modal.appendChild(box);

  box.querySelector('#cancelBtn').onclick = () =>
    document.body.removeChild(modal);

  return { modal };
}


// ------------------------------------------------------------
// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const apiEndpoint = '/api/details';

  // ---------------- DOM refs
  const tableElement = document.querySelector('#universitiesTable');
  const universitiesTableBody = document.querySelector('#universitiesTable tbody');
  const universitySearchInput = document.querySelector('#universitySearch');
  const universitiesPagination = document.querySelector('#universitiesPagination');
  const addUniversityBtn = document.querySelector('#addUniversityBtn');

  // scrollable wrapper (responsive)
  const tableWrapper = document.createElement('div');
  Object.assign(tableWrapper.style, { overflowX: 'auto', width: '100%' });
  tableElement.parentElement.insertBefore(tableWrapper, tableElement);
  tableWrapper.appendChild(tableElement);

  const cfg = { perPage: 5, currentPage: 1 };

  // ---------------- API helpers
  async function fetchUniversities() {
    try {
      const res = await fetch(apiEndpoint);
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function getUniversity(id) {
    try {
      const res = await fetch(`/api/details/${id}`);
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // ---------------- Table render
  async function renderTable() {
    const query = universitySearchInput.value.trim().toLowerCase();
    const data = await fetchUniversities();

    const filtered = data.filter(u =>
      u.university_name.toLowerCase().includes(query) ||
      u.country_name.toLowerCase().includes(query) ||
      (u.top_programs && u.top_programs.toLowerCase().includes(query)) ||
      (u.programs && JSON.stringify(u.programs).toLowerCase().includes(query)) ||
      (u.degree && u.degree.toLowerCase().includes(query))
    );

    const total = filtered.length;
    const start = (cfg.currentPage - 1) * cfg.perPage;
    const page = filtered.slice(start, start + cfg.perPage);

    universitiesTableBody.innerHTML = '';

    if (!page.length) {
      universitiesTableBody.innerHTML = `<tr><td colspan="14" style="text-align:center;">No universities found</td></tr>`;
    } else {
      page.forEach(u => {
        const programsDisplay = Array.isArray(u.programs) ? u.programs.join(', ') : (u.programs || '-');
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.detail_id || '-'}</td>
          <td><strong>${u.university_name}</strong></td>
          <td>${u.country_name}</td>
          <td>${u.world_ranking || '-'}</td>
          <td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${u.top_programs || '-'}">${u.top_programs || '-'}</td>
          <td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${u.application_deadlines || '-'}">${u.application_deadlines || '-'}</td>
          <td>${u.undergraduate_application_link ? `<a href="${u.undergraduate_application_link}" target="_blank">UG Apply</a>` : '-'}</td>
          <td>${u.masters_application_link ? `<a href="${u.masters_application_link}" target="_blank">MS Apply</a>` : '-'}</td>
          <td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${u.guidance || '-'}">${u.guidance || '-'}</td>
          <td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${programsDisplay}">${programsDisplay}</td>
          <td>${u.degree || '-'}</td>
          <td>${u.university_image ? `<img src="${u.university_image}" style="max-width:40px;border-radius:4px;">` : '-'}</td>
          <td>
  <button class="action-btn update" data-id="${u.university_id}" title="Edit">
    <i class="fas fa-edit"></i>
  </button>
  <button class="action-btn delete" data-id="${u.university_id}" title="Delete">
    <i class="fas fa-trash-alt"></i>
  </button>
</td>

        `;
        universitiesTableBody.appendChild(tr);
      });
    }

    // Pagination
    universitiesPagination.innerHTML = '';
    const paginationBtns = createPagination(total, cfg.perPage, cfg.currentPage, (pageNum) => {
      cfg.currentPage = pageNum;
      renderTable();
    });
    universitiesPagination.appendChild(paginationBtns);
  }

  function buildFormData(form) {
  const fd = new FormData(form);
  if (fd.get('programs')) {
    const clean = fd.get('programs')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .join(',');
    fd.set('programs', clean);
  }
  return fd;
}


  /* ---------- Add ---------- */
  /* ---------- Add ---------- */
addUniversityBtn.onclick = () => {
  const { modal } = createUniversityForm();
  document.body.appendChild(modal);

  modal.querySelector('#univForm').onsubmit = async e => {
    e.preventDefault();
    const body = buildFormData(e.target);

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body
      });

      if (!res.ok) throw new Error('Failed to add university');

      document.body.removeChild(modal);
      renderTable(); // refresh table
    } catch (err) {
      alert('Error: University add nahi ho saka.');
      console.error(err);
    }
  };
};



  /* ---------- Edit ---------- */
  // ---------- Update ----------
universitiesTableBody.addEventListener('click', async (e) => {
  if (e.target.closest('.update')) {
    const id = e.target.closest('.update').dataset.id;
    try {
      const univ = await getUniversity(id);
      const { modal } = createUniversityForm(univ);
      document.body.appendChild(modal);

      modal.querySelector('#univForm').onsubmit = async e => {
        e.preventDefault();
        const body = buildFormData(e.target);

        try {
          const res = await fetch(`${apiEndpoint}/${id}`, {
            method: 'PUT',
            body
          });

          if (!res.ok) throw new Error('Failed to update university');

          document.body.removeChild(modal);
          await renderTable();
        } catch (err) {
          console.error(err);
          alert('Error updating university. Please try again.');
        }
      };
    } catch (err) {
      alert('Failed to fetch university data.');
    }
  }




    // ---------------- Delete University
    if (e.target.classList.contains('delete')) {
      const id = e.target.dataset.id;
      if (confirm('Are you sure you want to delete this university?')) {
        try {
          const res = await fetch(`${apiEndpoint}/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Delete failed');
          alert('University deleted!');
          renderTable();
        } catch (err) {
          alert('Failed to delete university. Check console.');
          console.error(err);
        }
      }
    }
  });

  // ---------- Delete ----------
universitiesTableBody.addEventListener('click', async e => {
  const btn = e.target.closest('.delete'); // Agar user ne button ya uske icon pe click kiya
  if (!btn) return;

  const id = btn.dataset.id; // Button ke data-id se university ki ID nikal lo
  if (!confirm('Are you sure you want to delete this university?')) return;

  try {
    const res = await fetch(`/api/details/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    alert('Deleted successfully!');
    renderTable(); // Table ko refresh karo taake deleted item hat jaye
  } catch (err) {
    alert(err.message);
  }
});


  // ---------------- Search with debounce
  universitySearchInput.addEventListener('input', debounce(() => {
    cfg.currentPage = 1; // Reset to first page on new search
    renderTable();
  }, 300));

  // Initial render
  renderTable();
});
