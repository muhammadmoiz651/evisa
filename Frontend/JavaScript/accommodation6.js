// Fetch accommodation data from backend
fetch('/api/accommodations')
  .then(response => response.json())
  .then(data => {
    const accommodation = data.find(acc => acc.accommodation_id === 5);

    if (accommodation) {
      // Set main image
      const mainImageEl = document.querySelector('.main-image img');
      if (mainImageEl) mainImageEl.src = accommodation.image;

      // Set accommodation name
      const nameEl = document.querySelector('.accommodation-name');
      if (nameEl) nameEl.textContent = accommodation.name;

      // Set location
      const locationEl = document.querySelector('.accommodation-location');
      if (locationEl) locationEl.textContent = accommodation.location;

      const cityEl = document.querySelector('.accommodation-city');
      if (cityEl) cityEl.textContent = accommodation.city;

      const locationEll = document.querySelector('.accommodation-locations');
      if (locationEll) locationEll.textContent = accommodation.location;

      const locationElll = document.querySelector('.accommodation-locationss');
      if (locationElll) locationElll.textContent = accommodation.location;

      // Set price range
      const priceEl = document.querySelector('.accommodation-price');
      if (priceEl) priceEl.textContent = `€${accommodation.price_weekly} - €${accommodation.price_monthly}`;

      const priceEll = document.querySelector('.accommodation-prices');
      if (priceEl) priceEll.textContent = `€${accommodation.price_weekly} - €${accommodation.price_monthly}`;

      // Set star rating
      renderStarRating(accommodation.rating, '.stars');

      // Booking URL on button
      const bookNowBtn = document.querySelector('.btn-book');
      if (bookNowBtn) {
        bookNowBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const moveInDate = document.getElementById('move-in-date').value;
          const stayDuration = document.getElementById('stay-duration').value;

          if (!moveInDate) {
            alert('Please select a move-in date');
            return;
          }

          bookNowBtn.classList.add('booking');
          bookNowBtn.textContent = 'Processing...';

          setTimeout(() => {
            alert(`Awesome choice! Your accommodation interest for "${accommodation.name}" has been noted.\nTo complete your booking, you'll be redirected to The 4You Hotel's official site.\n\nMove-in Date: ${moveInDate}\nStay Duration: ${stayDuration} semester(s)\n\nSafe travels and see you soon in Munich!`);

            bookNowBtn.classList.remove('booking');
            bookNowBtn.textContent = 'Book Now';
            window.location.href = accommodation.bookingUrl;
          }, 1500);
        });
      }
    }
  })
  .catch(error => {
    console.error('Error fetching accommodation data:', error);
  });

// Function to render star rating
function renderStarRating(rating, selector) {
  const starContainer = document.querySelector(selector);
  if (starContainer) {
    const fullStars = Math.floor(rating);
    const halfStars = Math.round(rating) - fullStars;
    let starsHtml = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }

    // Half star
    if (halfStars === 1) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }

    // Empty stars
    const emptyStars = 5 - fullStars - halfStars;
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }

    starContainer.innerHTML = starsHtml;
  }
}
