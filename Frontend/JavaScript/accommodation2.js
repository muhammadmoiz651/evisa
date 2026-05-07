// accommodation2.js

// Fetch accommodation data function
export async function getAccommodationData() {
  try {
    const response = await fetch('/api/accommodations');
    const data = await response.json();
    const accommodation = data.find(acc => acc.accommodation_id === 1);
    return accommodation;
  } catch (error) {
    console.error('Error fetching accommodation data:', error);
    return null;
  }
}

export function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
  if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="far fa-star"></i>';
  return starsHTML;
}

export function setupPriceToggle(accommodation) {
  const weeklyOption = document.getElementById('weekly-option');
  const monthlyOption = document.getElementById('monthly-option');
  const priceValue = document.querySelector('.price-value');

  if (!weeklyOption || !monthlyOption || !priceValue) return;

  weeklyOption.addEventListener('click', () => {
    weeklyOption.classList.add('active');
    monthlyOption.classList.remove('active');
    priceValue.textContent = `€${accommodation.price_weekly}`;
  });

  monthlyOption.addEventListener('click', () => {
    monthlyOption.classList.add('active');
    weeklyOption.classList.remove('active');
    priceValue.textContent = `€${accommodation.price_monthly}`;
  });
}

export function setupBookButton(accommodation) {
  const bookButton = document.getElementById('book-button');
  if (!bookButton) return;

  bookButton.addEventListener('click', () => {
    window.open(accommodation.bookingUrl || '#', '_blank');
  });
}
