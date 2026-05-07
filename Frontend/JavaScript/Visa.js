

fetch('/api/visa-details')
  .then(response => response.json())
  .then(data => {
    const countriesGrid = document.getElementById('countries-grid');
    countriesGrid.innerHTML = ''; // clear existing cards

    data.forEach(visa => {
      const countryCard = document.createElement('div');
      countryCard.classList.add('country-card');

      countryCard.innerHTML = `
        <img src="${visa.image_url}" alt="${visa.country_name} Flag" />
        <h3>${visa.country_name}</h3>
        <p>${visa.title}</p>
        <div class="visa-inf">
          <ul>
            <li><i class="fas fa-clock"></i> Processing Time: ${visa.processing_time}</li>
            <li><i class="fas fa-language"></i> Language: ${visa.language_requirement}</li>
            <li><i class="fas fa-euro-sign"></i> Proof of Funds: ${visa.proof_of_funds}</li>
          </ul>
        </div>
        <div class="country-links">
          <a href="/${visa.country_name.toLowerCase()}visa" target="_blank" class="apply-btn">Apply for Visa</a>
        </div>
      `;

      countriesGrid.appendChild(countryCard);
    });
  })
  .catch(error => {
    console.error('Error fetching visa data:', error);
    document.getElementById('countries-grid').innerHTML = '<p>Failed to load visa information.</p>';
  });




document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navButtons = document.getElementById('navButtons');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('active');
  navButtons.classList.toggle('active');
  hamburger.textContent = menu.classList.contains('active') ? '✕' : '☰';
});


/* ========= CONFIG ========= */
const API_BASE = "http://localhost:3000";           // backend origin
const DOCS_ENDPOINT   = `${API_BASE}/api/required-documents`;
const APPTS_ENDPOINT  = `${API_BASE}/api/visa-appointments`;
const VIDEOS_ENDPOINT = `${API_BASE}/api/video-tutorials`;

/* ========= HELPERS ========= */
function el(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

/* ========= RENDER FUNCTIONS ========= */
async function renderRequiredDocuments() {
  try {
    const res  = await fetch(DOCS_ENDPOINT);
    const data = await res.json();

    const grid = document.querySelector(".requirements-grid");
    grid.innerHTML = "";

    data.forEach(d => {
      grid.append(
        el(`
          <div class="requirement-card">
            <div class="card-icon"><i class="${d.icon_class}"></i></div>
            <h3>${d.category}</h3>
            <ul>
              <li>${d.item1}</li>
              <li>${d.item2}</li>
              <li>${d.item3}</li>
              <li>${d.item4}</li>
            </ul>
            <a href="${d.portal_link}" class="btn" target="_blank">Visit Link</a>
          </div>
        `)
      );
    });
  } catch (err) {
    console.error("Required‑docs fetch error:", err);
  }
}

async function renderVisaAppointments() {
  try {
    const res  = await fetch(APPTS_ENDPOINT);
    const data = await res.json();

    const grid = document.querySelector(".appointment-grid");
    grid.innerHTML = "";

    data.forEach(a => {
      grid.append(
        el(`
          <div class="appointment-card">
            <div class="card-icon"><i class="${a.icon_class}"></i></div>
            <h3>${a.country}</h3>
            <p>${a.description}</p>
            <a href="${a.booking_link}" class="btn" target="_blank">Book Now</a>
          </div>
        `)
      );
    });
  } catch (err) {
    console.error("Appointments fetch error:", err);
  }
}

async function renderVideoTutorials() {
  try {
    const res  = await fetch(VIDEOS_ENDPOINT);
    const vids = await res.json();

    const container = document.getElementById("videosContainer");
    container.innerHTML = "";

    vids.forEach(v => {
      const card = el(`
        <div class="video-card">
          <div class="video-container">
            <img src="${v.thumbnail}" alt="${v.title}" class="video-thumbnail">
          </div>
          <div class="video-content">
            <h3>${v.title}</h3>
            <p>${v.description}</p>
            <span class="duration"><i class="far fa-clock"></i> ${v.duration}</span>
            <button class="watch-btn" data-video-id="${v.video_id}">Watch Now</button>
          </div>
        </div>
      `);
      container.append(card);
    });

    // attach listeners **after** cards exist
    container.querySelectorAll(".watch-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const id   = e.currentTarget.dataset.videoId;
        const card = e.currentTarget.closest(".video-card");
        const box  = card.querySelector(".video-container");
        box.innerHTML = `
          <iframe width="100%" height="300"
                  src="https://www.youtube.com/embed/${id}?autoplay=1"
                  frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
          </iframe>
        `;
      });
    });
  } catch (err) {
    console.error("Videos fetch error:", err);
  }
}

/* ========= BOOTSTRAP ========= */
document.addEventListener("DOMContentLoaded", () => {
  renderRequiredDocuments();
  renderVisaAppointments();
  renderVideoTutorials();
});




// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');
        
        // Close other answers
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.nextElementSibling.classList.remove('active');
                q.querySelector('i').style.transform = 'rotate(0)';
            }
        });
        
        // Toggle active class
        answer.classList.toggle('active');
        
        // Rotate icon
        icon.style.transform = answer.classList.contains('active') 
            ? 'rotate(180deg)' 
            : 'rotate(0)';
    });
});

// Document Checklist with Progress Bar
const checkboxes = document.querySelectorAll('.document input[type="checkbox"]');
const progress = document.querySelector('.progress');
const progressText = document.querySelector('.progress-text');

function updateProgress() {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    const percentage = (checked / total) * 100;
    
    progress.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}% Complete`;
    
    // Change progress bar color based on completion
    if (percentage === 100) {
        progress.style.backgroundColor = '#28a745';
        showCompletionMessage();
    } else {
        progress.style.backgroundColor = '#F4C542';
    }
}

function showCompletionMessage() {
    alert('Congratulations! You have all the required documents ready. You can now proceed with your visa application.');
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const label = checkbox.nextElementSibling;
        if (checkbox.checked) {
            label.style.backgroundColor = '#5D1049';
            label.style.color = '#F4F1DE';
        } else {
            label.style.backgroundColor = '#F4F1DE';
            label.style.color = '#000';
        }
        updateProgress();
    });
});

// Newsletter Form with Validation


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth Scroll

// Country Card Hover Effect
const countryCards = document.querySelectorAll('.country-card');

countryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = ' translateY(0)';
        card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
});

// Initialize progress bar
updateProgress();

// Add loading animation for external links
document.querySelectorAll('.apply-btn, .info-btn').forEach(link => {
    link.addEventListener('click', () => {
        link.style.opacity = '0.7';
        setTimeout(() => {
            link.style.opacity = '1';
        }, 200);
    });
});


document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        document.querySelector(targetId).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Add animation on scroll for cards
  const cards = document.querySelectorAll('.requirement-card, .appointment-card');
  
  function checkScroll() {
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < window.innerHeight - 100) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  }

  // Set initial state of cards
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  // Check card positions on scroll
  window.addEventListener('scroll', checkScroll);
  // Initial check
  checkScroll();

  // Active nav link highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu a');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
