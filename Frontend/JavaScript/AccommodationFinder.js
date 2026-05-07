// Initialize the map
let map;
let markers = [];

// Initialize the map with default coordinates (Barcelona)
function initMap() {
    // Create the map centered on Barcelona
    map = L.map('map').setView([41.3851, 2.1734], 12);

    // Add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Function to update the map with filtered accommodations
function updateMap(filteredAccommodations) {
    const locations = filteredAccommodations.map(acc => ({
        lat: acc.latitude,
        lng: acc.longitude
    }));

    // Clear existing markers from the map
    markers.forEach(marker => marker.remove());
    markers = [];

    // If no filtered accommodations, reset to default center (Barcelona)
    if (locations.length === 0) {
        map.setView([41.3851, 2.1734], 12); // Default to Barcelona
        return;
    }

    // Set the map center to the first accommodation's location
    const center = locations[0];
    map.setView(center, 12);

    // Add markers for each accommodation
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        markers.push(marker);
    });
}

const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navButtons = document.getElementById('navButtons');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('active');
  navButtons.classList.toggle('active');
  hamburger.textContent = menu.classList.contains('active') ? '✕' : '☰';
});

// Fetch accommodations from the backend when the page loads
async function fetchAccommodations() {
    try {
        const response = await fetch('/api/accommodations'); // Replace with actual API endpoint
        const data = await response.json();
        accommodations = data; // Store fetched accommodations
        renderAccommodations(accommodations);
    } catch (error) {
        console.error('Error fetching accommodations:', error);
    }
}

// Initialize map when the page loads
window.onload = initMap;

// Function to create star rating
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// Function to apply all filters
function applyFilters() {
    const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
    const selectedLocation = document.querySelector('.location-dropdown').value;
    const selectedType = document.querySelector('.accommodation-type').value;
    const maxPrice = parseInt(priceRange.value);
    const showAvailableOnly = document.querySelector('.availability-filter input').checked;

    // Filter accommodations based on the applied filters
    const filtered = accommodations.filter(accommodation => {
        const matchesSearch = accommodation.name.toLowerCase().includes(searchTerm) ||
            accommodation.location.toLowerCase().includes(searchTerm);

        const matchesLocation = !selectedLocation || accommodation.city === selectedLocation;
        const matchesType = !selectedType || accommodation.type === selectedType;
        const matchesPrice = accommodation.price_monthly <= maxPrice;
        const matchesAvailability = !showAvailableOnly || accommodation.available;

        return matchesSearch && matchesLocation && matchesType && matchesPrice && matchesAvailability;
    });

    renderAccommodations(filtered);
    updateMap(filtered);
}

// Function to render accommodation cards
function renderAccommodations(accommodations) {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '';

    if (accommodations.length === 0) {
        listingsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No accommodations found matching your criteria</p>
            </div>
        `;
        return;
    }

    accommodations.forEach(accommodation => {
        const card = document.createElement('div');
        card.className = 'accommodation-card';

        card.innerHTML = `
            <div class="card-image">
                <img src="${accommodation.image}" alt="${accommodation.name}">
            </div>
            <div class="card-content">
                <h3 class="card-title">${accommodation.name}</h3>
                <p class="card-location">
                    <i class="fas fa-map-marker-alt"></i> 
                    ${accommodation.location}
                </p>
                <p class="card-price">
                    £${accommodation.price_weekly}/week | £${accommodation.price_monthly}/month
                </p>
                <div class="card-rating">
                    ${createStarRating(accommodation.rating)}
                </div>
                <span class="availability-badge" style="background-color: ${accommodation.available ? '#5D1049' : '#f44336'}">
                    ${accommodation.available ? 'Available' : 'Unavailable'}
                </span>
                <button class="view-details-btn" data-id="${accommodation.id}" data-url="${accommodation.details_url}">View Details</button>
            </div>
        `;

        listingsContainer.appendChild(card);
    });

    // Add event listeners for "View Details" buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const url = e.target.getAttribute('data-url'); // Get the URL from data-url attribute
            if (url) {
                window.open(url, '_blank'); // Open the accommodation's URL in a new tab
            }
        });
    });
}

// Function to create star rating
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}
// Fetch accommodations from the backend when the page loads
fetchAccommodations();

// Event listeners for all filters
document.querySelector('.search-bar input').addEventListener('input', applyFilters);
document.querySelector('.location-dropdown').addEventListener('change', applyFilters);
document.querySelector('.accommodation-type').addEventListener('change', applyFilters);
document.querySelector('.availability-filter input').addEventListener('change', applyFilters);

// Add smooth scroll to map when clicking on location
document.addEventListener('click', (e) => {
    if (e.target.closest('.card-location')) {
        document.querySelector('.map-container').scrollIntoView({
            behavior: 'smooth'
        });
    }
});
