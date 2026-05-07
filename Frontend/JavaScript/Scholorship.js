document.addEventListener("DOMContentLoaded", () => {
    const chatbotContainer = document.getElementById("chatbot-container");
    const requestBtn = document.getElementById("request-guidance-btn");
    const closeBtn = document.getElementById("close-chat");

    // Show chatbot on request button click
    requestBtn.addEventListener("click", () => {
      chatbotContainer.classList.remove("hidden");
    });

    // Hide chatbot on close button click
    closeBtn.addEventListener("click", () => {
      chatbotContainer.classList.add("hidden");
    });
  });



// State management
let scholarships = []; // Initialize as empty
let currentPage = 1;
const itemsPerPage = 6; // Show 3 items per page for better pagination testing
let filteredScholarships = [];

// DOM Elements
const scholarshipGrid = document.getElementById("scholarshipGrid");
const searchInput = document.getElementById("searchInput");
const countryFilter = document.getElementById("countryFilter");
const universityFilter = document.getElementById("universityFilter");
const degreeFilter = document.getElementById("degreeFilter");
const typeFilter = document.getElementById("typeFilter");
const applyFiltersBtn = document.getElementById("applyFilters");
const resetFiltersBtn = document.getElementById("resetFilters");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageNumbers = document.getElementById("pageNumbers");

// Create success message element
const successMessage = document.createElement("div");
successMessage.className = "success-message";
document.body.appendChild(successMessage);

// Show success message function
function showSuccessMessage(message) {
  successMessage.textContent = message;
  successMessage.classList.add("show");
  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 3000);
}

// Create scholarship card
// Create scholarship card
function createScholarshipCard(scholarship) {
  const card = document.createElement("div");
  card.className = "scholarship-card";
  card.innerHTML = `
        <button class="bookmark-btn" data-id="${scholarship.scholarship_id}">
            <i class="far fa-heart"></i>
        </button>
        
        <h3 class="card-title">${scholarship.title}</h3>
        <ul class="card-details">
            ${scholarship.degrees
              .map((degree) => `<li>${degree}</li>`)
              .join("")}
        </ul>
        <p class="deadline">Application Closes: ${scholarship.deadline}</p>
        <p class="amount">${scholarship.amount}</p>
        <button class="cta-button apply-now-btn">Apply Now</button>
    `;

  // Add bookmark functionality
  const bookmarkBtn = card.querySelector(".bookmark-btn");
  bookmarkBtn.addEventListener("click", () => {
    const icon = bookmarkBtn.querySelector("i");
    icon.classList.toggle("far");
    icon.classList.toggle("fas");
    showSuccessMessage("Scholarship saved to your bookmarks!");
  });

  // Add apply now functionality
  const applyBtn = card.querySelector(".apply-now-btn");
  applyBtn.addEventListener("click", () => {
    showSuccessMessage(
      "Redirecting to application page for " + scholarship.title
    );
    window.open(scholarship.apply_link, "_blank"); // Opens apply link in new tab
  });

  return card;
}

// Render scholarships with pagination
function renderScholarships() {
  scholarshipGrid.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageScholarships = filteredScholarships.slice(start, end);

  if (pageScholarships.length === 0) {
    scholarshipGrid.innerHTML =
      '<p class="no-results">No scholarships found matching your criteria.</p>';
    return;
  }

  pageScholarships.forEach((scholarship) => {
    scholarshipGrid.appendChild(createScholarshipCard(scholarship));
  });
}

// Update pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  pageNumbers.innerHTML = "";

  // Only show pagination if there's more than one page
  if (totalPages <= 1) {
    prevPageBtn.style.display = "none";
    nextPageBtn.style.display = "none";
    pageNumbers.style.display = "none";
    return;
  }

  prevPageBtn.style.display = "block";
  nextPageBtn.style.display = "block";
  pageNumbers.style.display = "flex";

  // Create page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageNum = document.createElement("button");
    pageNum.className = `page-number ${i === currentPage ? "active" : ""}`;
    pageNum.textContent = i;
    pageNum.addEventListener("click", () => {
      if (currentPage !== i) {
        currentPage = i;
        renderScholarships();
        updatePagination();
      }
    });
    pageNumbers.appendChild(pageNum);
  }

  // Update prev/next button states
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

// Filter scholarships
function filterScholarships() {
  const searchTerm = searchInput.value.toLowerCase();
  const country = countryFilter.value.toLowerCase().trim();
  const university = universityFilter.value.toLowerCase().trim();
  const degree = degreeFilter.value.toLowerCase().trim();
  const type = typeFilter.value.toLowerCase().trim();

  filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm) ||
      (scholarship.university &&
        scholarship.university.toLowerCase().includes(searchTerm));
    const matchesCountry = !country || scholarship.country_name.toLowerCase() === country.toLowerCase();

    const matchesUniversity =
      !university || // If no university filter is applied, match all
      (scholarship.university_name &&
        scholarship.university_name.toLowerCase().includes(university.toLowerCase()));

    const matchesDegree =
      !degree || // If no degree filter is applied, match all
      (scholarship.degrees &&
        scholarship.degrees.some((d) => d.toLowerCase().includes(degree.toLowerCase())));

    const matchesType =
      !type || // If no type filter is applied, match all
      (scholarship.type && scholarship.type.toLowerCase() === type.toLowerCase());


    return (
      matchesSearch &&
      matchesCountry &&
      matchesUniversity &&
      matchesDegree &&
      matchesType
    );
  });

  currentPage = 1;
  renderScholarships();
  updatePagination();
}

// Fetch scholarships from API
async function fetchScholarships() {
  try {
    const response = await fetch("http://localhost:3000/scholarshipsapi"); // Full URL
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched scholarships data:", data); // Debug log

    scholarships = data.map((scholarship) => ({
      ...scholarship,
      degrees: scholarship.degrees || [], // Ensure degrees is an array
    }));
    filteredScholarships = [...scholarships];
    renderScholarships();
    updatePagination();
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    scholarshipGrid.innerHTML = '<p class="error">Failed to load scholarships.</p>';
  }
}


// Event listeners
searchInput.addEventListener("input", filterScholarships);
applyFiltersBtn.addEventListener("click", filterScholarships);
resetFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  countryFilter.value = "";
  universityFilter.value = "";
  degreeFilter.value = "";
  typeFilter.value = "";
  filteredScholarships = [...scholarships];
  currentPage = 1;
  renderScholarships();
  updatePagination();
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderScholarships();
    updatePagination();
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderScholarships();
    updatePagination();
  }
});

// Initialize the page
fetchScholarships();
