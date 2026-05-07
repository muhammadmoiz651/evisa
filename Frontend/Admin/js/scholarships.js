
const ITEMS_PER_PAGE = 6; // Number of items per page
let currentPage = 1;


// API Endpoint for Scholarships
const apiEndpoint = '/scholarshipsapi';

// DOM elements
const scholarshipsTable = document.querySelector('#scholarshipsTable tbody');
const addScholarshipBtn = document.getElementById('addScholarshipBtn');
const scholarshipSearch = document.getElementById('scholarshipSearch');
const scholarshipsPagination = document.getElementById('scholarshipsPagination');

// Event Listeners
addScholarshipBtn.addEventListener('click', showAddScholarshipForm);
scholarshipSearch.addEventListener('input', searchScholarships);

// Fetch and Render Scholarships
scholarshipsPagination.addEventListener('click', handlePagination);

// Fetch and Render Scholarships with Pagination
async function fetchScholarships() {
  try {
    const response = await fetch(apiEndpoint);
    const scholarships = await response.json();
    renderScholarshipsTable(scholarships);
    renderPagination(scholarships.length); // To display pagination controls
  } catch (error) {
    console.error('Error fetching scholarships:', error);
  }
}

// Render Scholarships Table with Pagination
function renderScholarshipsTable(scholarships) {
  scholarshipsTable.innerHTML = '';
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const scholarshipsToDisplay = scholarships.slice(startIndex, endIndex);

  scholarshipsToDisplay.forEach(scholarship => {
    const row = document.createElement('tr');
    row.innerHTML = `
  <td>${scholarship.scholarship_id}</td>
  <td>${scholarship.title}</td>
  <td>${scholarship.university_name}</td>
  <td>${scholarship.degrees}</td>
  <td>${scholarship.deadline}</td>
  <td>${scholarship.amount}</td>
  <td>${scholarship.type}</td>
  <td>
    <button class="action-btn edit" data-id="${scholarship.scholarship_id}" title="Edit scholarship">
      <i class="fas fa-edit"></i>
    </button>
    <button class="action-btn delete" data-id="${scholarship.scholarship_id}" title="Delete scholarship">
      <i class="fas fa-trash"></i>
    </button>
  </td>
`;

    row.querySelector('.edit').addEventListener('click', (e) => {
      const button = e.currentTarget; // Always refers to the actual button
      const scholarshipId = button.getAttribute('data-id');
      showEditScholarshipForm(scholarshipId);
    });

    row.querySelector('.delete').addEventListener('click', (e) => {
      const scholarshipId = e.target.closest('.delete').getAttribute('data-id');
      deleteScholarship(scholarshipId);
    });
    scholarshipsTable.appendChild(row);
  });
}

// Render Pagination Controls
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  scholarshipsPagination.innerHTML = ''; // Clear existing pagination

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = 'page-btn';
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      fetchScholarships();
    });
    scholarshipsPagination.appendChild(pageBtn);
  }
}

// Handle Pagination Button Click
function handlePagination(event) {
  if (event.target.classList.contains('page-btn')) {
    currentPage = Number(event.target.textContent);
    fetchScholarships();
  }
}


// Search Scholarships
function searchScholarships() {
  const searchText = scholarshipSearch.value.toLowerCase();
  const rows = scholarshipsTable.querySelectorAll('tr');
  rows.forEach(row => {
    const title = row.cells[1].textContent.toLowerCase();
    const university = row.cells[2].textContent.toLowerCase();
    if (title.includes(searchText) || university.includes(searchText)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Show Add Scholarship Form
function showAddScholarshipForm() {
  const form = createAddScholarshipForm();
  showModal('Add Scholarship', form);
}

// Create Add Scholarship Form
function createAddScholarshipForm() {
  const form = document.createElement('form');
  form.innerHTML = `
    <label for="scholarship_id">Scholarship ID</label>
    <input type="number" id="scholarship_id" name="scholarship_id" required />

    <label for="title">Title</label>
    <input type="text" id="title" name="title" required />

    <label for="university_id">University</label>
    <input type="number" id="university_id" name="university_id" required />

    <label for="degrees">Degrees</label>
    <input type="text" id="degrees" name="degrees" required />

    <label for="deadline">Deadline</label>
    <input type="date" id="deadline" name="deadline" required />

    <label for="amount">Amount</label>
    <input type="text" id="amount" name="amount" required />

    <label for="country_id">Country</label>
    <input type="number" id="country_id" name="country_id" placeholder="1. France, 2. Spain, 3. Germany" required />

    <label for="type">Type</label>
    <input type="text" id="type" name="type" required />

    <button type="submit" class="btn primary">Add Scholarship</button>
  `;

  function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Ensure degrees is converted to an array if entered as a comma-separated string
    data.degrees = data.degrees.split(',').map(degree => degree.trim());

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        alert("The Scholorships has been successfully added to the list!");
        closeModal();
        showNotification(result.message, 'success');
        fetchScholarships();
        closeModal();
      } else {
        showNotification('Error adding scholarship', 'error');
      }
    } catch (error) {
      showNotification('Error adding scholarship', 'error');
    }
  });
  form.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close')) {
      closeModal();
    }
  });

  return form;
}

async function showEditScholarshipForm(scholarshipId) {
  const scholarship = await fetchScholarshipById(scholarshipId);
  const form = createEditScholarshipForm(scholarship);
  showModal('Edit Scholarship', form);
}

// Fetch Single Scholarship Data
async function fetchScholarshipById(scholarshipId) {
  const response = await fetch(`${apiEndpoint}/${scholarshipId}`);
  const data = await response.json();
  return data;
}

// Create Edit Scholarship Form
function createEditScholarshipForm(scholarship) {
  const form = document.createElement('form');
  form.innerHTML = `
   
        
      

    <label for="title">Title</label>
    <input type="text" id="title" name="title" value="${scholarship.title}" required />

    <label for="university_id">University</label>
    <input type="number" id="university_id" name="university_id" value="${scholarship.university_id}" required />

    <label for="degrees">Degrees</label>
    <input type="text" id="degrees" name="degrees" value="${scholarship.degrees}" required />

    <label for="deadline">Deadline</label>
    <input type="date" id="deadline" name="deadline" value="${scholarship.deadline}" required />

    <label for="amount">Amount</label>
    <input type="text" id="amount" name="amount" value="${scholarship.amount}" required />

    <label for="country_id">Country</label>
    <input type="number" id="country_id" name="country_id" value="${scholarship.country_id}" required />

    <label for="type">Type</label>
    <input type="text" id="type" name="type" value="${scholarship.type}" required />

    <button type="submit" class="btn primary">Update Scholarship</button>
  `;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Ensure degrees is converted to an array if entered as a comma-separated string
    data.degrees = data.degrees.split(',').map(degree => degree.trim());

    try {
      const response = await fetch(`${apiEndpoint}/${scholarship.scholarship_id}`, {  // Pass the scholarship_id in the URL
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        alert("The Scholorships has been Updated Successfully!");
        closeModal();
        showNotification(result.message, 'success');
        fetchScholarships(); // Reload the table with the updated data
      } else {
        showNotification('Error updating scholarship', 'error');
      }
    } catch (error) {
      showNotification('Error updating scholarship', 'error');
    }
  });
  form.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close')) {
      closeModal();
    }
  });

  return form;
}

// Delete Scholarship
async function deleteScholarship(scholarshipId) {
  const confirmDelete = confirm('Are you sure you want to delete this scholarship?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${apiEndpoint}/${scholarshipId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
      showNotification(result.message, 'success');
      fetchScholarships(); // Reload the table with the updated data
    } else {
      showNotification('Error deleting scholarship', 'error');
    }
  } catch (error) {
    showNotification('Error deleting scholarship', 'error');
  }
}

// Show Notification
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Initialize the page
fetchScholarships();
