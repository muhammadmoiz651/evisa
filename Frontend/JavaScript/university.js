// DOM Elements
const searchInput = document.getElementById("searchInput");
const countryFilter = document.getElementById("countryFilter");
const degreeFilter = document.getElementById("degreeFilter");
const programFilter = document.getElementById("programFilter");
const applyFiltersBtn = document.getElementById("applyFilters");
const resetFiltersBtn = document.getElementById("resetFilters");
const universityGrid = document.getElementById("universityGrid");
const paginationContainer = document.getElementById("pagination");

// Pagination settings
const itemsPerPage = 6;
let currentPage = 1;
let universities = [];
let filteredUniversities = [];

// Fetch universities data from backend
async function fetchUniversities() {
  try {
    const response = await fetch('http://localhost:3000/universitiesapi');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    universities = data;
    filteredUniversities = [...universities];
    displayUniversities();
    updatePagination();
  } catch (error) {
    console.error('Error fetching universities:', error);
    universityGrid.innerHTML = `
      <p class="error-message">Failed to load university data. Please try again later.</p>
    `;
  }
}

// Filter and search functionality
function filterUniversities() {
  const searchTerm = searchInput.value.toLowerCase();
  const country = countryFilter.value.trim(); // Get the selected country filter value
  const degree = degreeFilter.value.trim();  // Get the selected degree filter value
  const program = programFilter.value.trim().toLowerCase(); // Get the selected program filter value

  // Apply filters to the university list
  filteredUniversities = universities.filter((uni) => {
    // Check if the university name or country matches the search term
    const matchesSearch =
      (uni.university_name && uni.university_name.toLowerCase().includes(searchTerm)) ||
      (uni.country_name && uni.country_name.toLowerCase().includes(searchTerm));

    // Check if the filters match
    const matchesCountry = !country || uni.country_name.toLowerCase() === country.toLowerCase();
    const matchesDegree = !degree || uni.degree === degree;
    const matchesProgram =
      !program || (uni.program && uni.program.toLowerCase().includes(program));

    return matchesSearch && matchesCountry && matchesDegree && matchesProgram;
  });

  // Reset to the first page and update display
  currentPage = 1;
  displayUniversities();
  updatePagination();
}



function displayUniversities() {
  universityGrid.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

  if (paginatedUniversities.length === 0) {
    universityGrid.innerHTML = `
      <p class="no-results-message">No universities found. Please adjust your filters.</p>
    `;
    return;
  }

  paginatedUniversities.forEach((uni) => {
    const card = document.createElement("div");
    card.className = "university-card";

    const universityLink = uni.details_link || null;
 // Or whatever your link field is

    const programs = uni.programs || [];
    const firstTwo = programs.slice(0, 2);
    const lastTwo = programs.slice(-2);

    const displayedPrograms = [...firstTwo, ...lastTwo];

    card.innerHTML = `
      <img src="${uni.image}" alt="${uni.university_name || 'No Image Available'}" class="university-image">
      <div class="university-details">
        <h3 class="university-name">${uni.university_name || "No Name Available"}</h3>
        <p class="university-country">${uni.country_name || "Country Not Specified"}</p>
        <ul class="university-programs">
          ${displayedPrograms.length > 0
            ? displayedPrograms.map(
                (program) => `
                  <li class="program-item">
                    <i class="fas fa-graduation-cap"></i> ${program}
                  </li>`
              ).join("")
            : "<li>No Programs Available</li>"
          }
        </ul>
        ${
          universityLink
            ? `<a href="${universityLink}"><button class="view-details">View Details</button></a>`
            : `<button class="view-details disabled" disabled>Not Available</button>`
        }
      </div>
    `;

    universityGrid.appendChild(card);
  });
}



// Pagination functionality
function updatePagination() {
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  // Previous button
  const prevButton = document.createElement("button");
  prevButton.textContent = "←";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayUniversities();
      updatePagination();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.toggle("active", i === currentPage);
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayUniversities();
      updatePagination();
    });
    paginationContainer.appendChild(pageButton);
  }

  // Next button
  const nextButton = document.createElement("button");
  nextButton.textContent = "→";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayUniversities();
      updatePagination();
    }
  });
  paginationContainer.appendChild(nextButton);
}

// Event listeners
searchInput.addEventListener("input", filterUniversities);
applyFiltersBtn.addEventListener("click", filterUniversities);
resetFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  countryFilter.value = "";
  degreeFilter.value = "";
  programFilter.value = "";
  filteredUniversities = [...universities];
  currentPage = 1;
  displayUniversities();
  updatePagination();
});

// Initial fetch and display
fetchUniversities();
