const API = "http://localhost:3000";  // backend base URL

// Modal elements
const modal = document.getElementById("modalForm");
const modalTitle = document.getElementById("modalTitle");
const modalForm = document.getElementById("modalInnerForm");
const modalCancelBtn = document.getElementById("modalCancelBtn");

// Open modal function - dynamically create form inputs
function openModal(title, fields, defaultValues = {}, onSubmit) {
  modalTitle.textContent = title;
  modalForm.innerHTML = "";

  fields.forEach(field => {
    const val = defaultValues[field.name] || "";
    const label = document.createElement("label");
    label.textContent = field.label;
    label.style.display = "block";
    label.style.marginTop = "10px";

    let input;
    if(field.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 3;
    } else {
      input = document.createElement("input");
      input.type = field.type || "text";
    }
    input.name = field.name;
    input.value = val;
    input.style.width = "100%";
    input.required = field.required || false;

    label.appendChild(input);
    modalForm.appendChild(label);
  });

  // Create submit button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Submit";
  // Inline CSS for submit button
  submitBtn.style.cssText = `
    background-color: #5D1049;  /* Green */
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
    margin-top: 15px;
  `;
  modalForm.appendChild(submitBtn);

  function submitHandler(e) {
    e.preventDefault();
    const data = {};
    fields.forEach(f => {
      data[f.name] = modalForm.elements[f.name].value.trim();
    });
    onSubmit(data);
    closeModal();
  }

  modalForm.addEventListener("submit", submitHandler, { once: true });
  modal.style.display = "block";
}

// Inline CSS for Cancel button (apply once on script load)
modalCancelBtn.style.cssText = `
  background-color: #F4C542;   /* Red color */
  color: #5D1049;
  border: none;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
`;



// Close modal
function closeModal() {
  modal.style.display = "none";
}

modalCancelBtn.onclick = closeModal;

// Load all on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  loadDocs();
  loadAppointments();
  loadVideos();
});

/* ---------- REQUIRED DOCUMENTS ---------- */
async function loadDocs(){
  const rows = await fetch(`${API}/api/required-documents`).then(r => r.json());
  const tb = document.getElementById("docsTableBody");
  tb.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.category}</td>
      <td>${r.items.join(", ")}</td>
      <td>
        <button title="Edit" onclick="editDoc(${r.id})" style="background:none; border:none; cursor:pointer; color:black;">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button title="Delete" onclick="deleteDoc(${r.id})" style="background:none; border:none; cursor:pointer; color:black; margin-left:10px;">
        <i class="fas fa-trash"></i>
      </button>
      </td>
    </tr>`).join("");
}

async function showAddDocForm(){
  openModal("Add Required Document", [
    { name: "category", label: "Category", required: true },
    { name: "items", label: "Items (comma-separated)", required: true }
  ], {}, async (data) => {
    const items = data.items.split(",").map(s => s.trim()).filter(Boolean);
    await fetch(`${API}/api/required-documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: data.category, icon_class: "fas fa-file-alt", items })
    });
    loadDocs();
  });
}

async function editDoc(id){
  const row = await fetch(`${API}/api/required-documents`)
    .then(r => r.json()).then(arr => arr.find(r => r.id === id));
  
  openModal("Edit Required Document", [
    { name: "category", label: "Category", required: true },
    { name: "items", label: "Items (comma-separated)", required: true }
  ], { category: row.category, items: row.items.join(", ") }, async (data) => {
    const items = data.items.split(",").map(s => s.trim()).filter(Boolean);
    await fetch(`${API}/api/required-documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: data.category, icon_class: row.icon_class, items })
    });
    loadDocs();
  });
}

function deleteDoc(id){
  if(!confirm("Delete?")) return;
  fetch(`${API}/api/required-documents/${id}`, { method: "DELETE" })
    .then(loadDocs);
}

/* ---------- VISA APPOINTMENTS ---------- */
async function loadAppointments(){
  const rows = await fetch(`${API}/api/visa-appointments`).then(r => r.json());
  const tb = document.getElementById("apptTableBody");
  tb.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.country}</td>
      <td><a href="${r.booking_link}" target="_blank">Booking Appointment</a></td>
      <td>
        <button title="Edit" onclick="editAppt(${r.id})" style="background:none; border:none; cursor:pointer; color:black;">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button title="Delete" onclick="deleteAppt(${r.id})" style="background:none; border:none; cursor:pointer; color:black; margin-left:10px;">
        <i class="fas fa-trash"></i>
      </button>
      </td>
    </tr>`).join("");
}

async function showAddApptForm(){
  openModal("Add Visa Appointment", [
    { name: "country", label: "Country", required: true },
    { name: "booking_link", label: "Booking Link (URL)", required: true }
  ], {}, async (data) => {
    await fetch(`${API}/api/visa-appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: data.country, icon_class: "fas fa-calendar-check", description: "", booking_link: data.booking_link })
    });
    loadAppointments();
  });
}

async function editAppt(id){
  const row = await fetch(`${API}/api/visa-appointments`)
    .then(r => r.json()).then(arr => arr.find(r => r.id === id));

  openModal("Edit Visa Appointment", [
    { name: "country", label: "Country", required: true },
    { name: "booking_link", label: "Booking Link (URL)", required: true }
  ], { country: row.country, booking_link: row.booking_link }, async (data) => {
    await fetch(`${API}/api/visa-appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: data.country, icon_class: row.icon_class, description: row.description, booking_link: data.booking_link })
    });
    loadAppointments();
  });
}

function deleteAppt(id){
  if(!confirm("Delete?")) return;
  fetch(`${API}/api/visa-appointments/${id}`, { method: "DELETE" })
    .then(loadAppointments);
}

/* ---------- VIDEO TUTORIALS ---------- */
async function loadVideos(){
  const rows = await fetch(`${API}/api/video-tutorials`).then(r => r.json());
  const tb = document.getElementById("videoTableBody");
  tb.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.title}</td>
      <td>${r.video_id}</td>
      <td>
        <button title="Edit" onclick="editVideo(${r.id})" style="background:none; border:none; cursor:pointer; color:black;">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button title="Delete" onclick="deleteVideo(${r.id})" style="background:none; border:none; cursor:pointer; color:black; margin-left:10px;">
        <i class="fas fa-trash"></i>
      </button>
      </td>
    </tr>`).join("");
}

async function showAddVideoForm(){
  openModal("Add Video Tutorial", [
    { name: "title", label: "Video Title", required: true },
    { name: "video_id", label: "YouTube Video ID", required: true }
  ], {}, async (data) => {
    await fetch(`${API}/api/video-tutorials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: data.video_id, title: data.title, description: "", duration: "", thumbnail: `https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg` })
    });
    loadVideos();
  });
}

async function editVideo(id){
  const row = await fetch(`${API}/api/video-tutorials`)
    .then(r => r.json()).then(arr => arr.find(r => r.id === id));

  openModal("Edit Video Tutorial", [
    { name: "title", label: "Video Title", required: true },
    { name: "video_id", label: "YouTube Video ID", required: true }
  ], { title: row.title, video_id: row.video_id }, async (data) => {
    await fetch(`${API}/api/video-tutorials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: data.video_id, title: data.title, description: row.description, duration: row.duration, thumbnail: `https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg` })
    });
    loadVideos();
  });
}

function deleteVideo(id){
  if(!confirm("Delete?")) return;
  fetch(`${API}/api/video-tutorials/${id}`, { method: "DELETE" })
    .then(loadVideos);
}
