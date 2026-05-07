import { getAccommodationData, generateStarRating, setupPriceToggle, setupBookButton } from '/JavaScript/accommodation2.js';

async function renderAccommodationDetails() {
  const accommodationData = await getAccommodationData();
  if (!accommodationData) return;

  document.querySelector('#app').innerHTML = `
    <header>
    <nav>
      <div class="logo">
        <a href="/home"><img src="/Assests/pictures/Study_e-visa-removebg-preview.png"
            alt="Logo" class="logo-img" /></a>
      </div>
      <ul class="menu">
        <li><a href="/home" >Home</a></li>
        <li><a href="/universityexplorer">University</a></li>
        <li><a href="/scholarshipfinder">Scholarships</a></li>
        <li><a href="/accommodationfinder" class="active">Accommodation</a></li>
        <li>
          <a href="/eligibilitychecker">Eligibility Checker</a>
        </li>
        <li><a href="/europasscv">Europass CV</a></li>
        <li><a href="/visa">Visa Guide</a></li>
        <li><a href="/testprepration">Test Prep</a></li>
      </ul>
      <button id="loginBtn" class="login-btn" style="display: block;">logout</button>
      <button id="logoutBtn" class="login-btn" style="display: none;">logout</button>

    </nav>
  </header>
  
<div class="accommodation-details">
      <main class="container">
        <img 
          src="${accommodationData.image}" 
          alt="${accommodationData.name}" 
          class="accommodation-image"
        />
        
        <div class="details-header">
          <div class="details-title">
            <h1>${accommodationData.name}</h1>
            <div class="details-location">
              <i class="fas fa-map-marker-alt"></i>
              <span>${accommodationData.location}</span>
            </div>
          </div>

          <div class="details-price">
            <div class="price-header">
              <div class="price-title">Price</div>
              <div class="price-rating">
                <div class="rating-stars">${generateStarRating(accommodationData.rating)}</div>
                <span class="rating-value">${accommodationData.rating}</span>
              </div>
            </div>

            <div class="price-options">
              <div id="weekly-option" class="price-option active">
                <div>Weekly</div>
                <div class="price-value">€${accommodationData.price_weekly}</div>
              </div>
              <div id="monthly-option" class="price-option">
                <div>Monthly</div>
                <div class="price-value">€${accommodationData.price_monthly}</div>
              </div>
            </div>

            <button id="book-button" class="book-button">Book Now</button>

            <div class="availability">
              <span class="availability-badge"></span>
              ${accommodationData.available ? 'Available Now' : 'Currently Unavailable'}
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="details-information">
            <div class="details-section">
              <h2 class="details-section-title">
                <i class="fas fa-info-circle"></i>
                About this accommodation
              </h2>
              <p>
  Located in the heart of the city, this accommodation provides a comfortable, student-friendly environment with essential amenities to support your academic journey.
</p>
<p><strong>Type:</strong> ${accommodationData.type.charAt(0).toUpperCase() + accommodationData.type.slice(1)}</p>
<p><strong>City:</strong> ${accommodationData.city.charAt(0).toUpperCase() + accommodationData.city.slice(1)}</p>

            </div>

            <div class="details-section">
              <h2 class="details-section-title">
                <i class="fas fa-map-marked-alt"></i>
                Location
              </h2>
              <div class="map-container">
                <iframe 
                  src="https://www.google.com/maps?q=${accommodationData.latitude},${accommodationData.longitude}&hl=es;z=14&output=embed"
                  allowfullscreen=""
                  loading="lazy"
                  style="width: 100%; height: 350px; border: 0;">
                </iframe>
              </div>
            </div>
          </div>

          <div class="details-side">
            <div class="details-section">
              <h2 class="details-section-title">
                <i class="fas fa-concierge-bell"></i>
                Amenities
              </h2>
              <ul class="amenities-list">
  <ul class="amenities-list">
  ${[
    { name: 'Wi-Fi', icon: 'fa-wifi' },
    { name: 'Air Conditioning', icon: 'fa-snowflake' },
    { name: 'Laundry', icon: 'fa-shirt' },
    { name: 'Study Room', icon: 'fa-book' },
    { name: 'Gym', icon: 'fa-dumbbell' },
    { name: 'Bike Rental', icon: 'fa-bicycle' },
    { name: 'Cleaning Service', icon: 'fa-broom' },
    { name: 'Breakfast', icon: 'fa-mug-hot' },
    { name: 'Daily Coffee', icon: 'fa-coffee' },
    { name: 'Yoga/Trainer', icon: 'fa-child' },
    { name: 'Social Events', icon: 'fa-users' },
    { name: 'Cooking Classes', icon: 'fa-utensils' },
    { name: 'Swimming Pool Access', icon: 'fa-swimmer' }
  ].map(amenity => `
    <li>
      <i class="fas ${amenity.icon}"></i>
      ${amenity.name}
    </li>
  `).join('')}
</ul>


            </div>

            <div class="details-section">
              <h2 class="details-section-title">
                <i class="fas fa-question-circle"></i>
                Need Help?
              </h2>
              <p>Contact our support team for any questions about this accommodation.</p>
           <a href="mailto:hello@vitastudent.com"> <button class="book-button">
                <i class="fas fa-headset"></i>
                Contact Support </a>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <footer>
    <div class="footer-container">
      <div class="footer-section about-us">
        <h3>About Us</h3>
        <p>
          We help students achieve their dreams of studying in Europe through
          comprehensive visa and education guidance.
        </p>
      </div>

      <div class="footer-section quick-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Scholarships</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      <div class="footer-section connect">
        <h3>Connect</h3>
        <div class="social-icons">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>

      <div class="footer-section newsletter">
        <h3>Newsletter</h3>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
    <div class="footer-bottom">
      <hr />
      <p>&copy; 2025 EStudyVisa. All rights reserved.</p>
    </div>
  </footer>
  `;

  setupPriceToggle(accommodationData);
  setupBookButton(accommodationData);
}

renderAccommodationDetails();
