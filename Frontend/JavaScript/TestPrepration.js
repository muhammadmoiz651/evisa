// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
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

function scrollToResource() {
  document.getElementById("services").scrollIntoView({ behavior: "smooth" });
}

// Enhanced resource items interaction
document.querySelectorAll(".resource-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.querySelector("i").style.transform = "scale(1.2) rotate(5deg)";
  });

  item.addEventListener("mouseleave", () => {
    item.querySelector("i").style.transform = "scale(1) rotate(0deg)";
  });
});

const testimonialContainer = document.querySelector(".testimonials-container");
const form = document.getElementById("testimonialForm");
const container = document.getElementById("testimonialsContainer");

let scrollPosition = 0;
const scrollSpeed = 0.5;
let isPaused = false;

// Function to add a testimonial element
function addTestimonial(t) {
  const stars = "⭐".repeat(t.rating);
  const html = `
    <div class="testimonial">
      <div class="student-image">
        <img src="http://localhost:3000/${t.image}" alt="Student" />
      </div>
      <p class="quote">"${t.quote}"</p>
      <div class="rating">${stars}</div>
      <p class="student-name">- ${t.name}</p>
    </div>`;
  container.insertAdjacentHTML("beforeend", html);
}

// Fetch testimonials from backend and add them, then start scrolling
fetch("http://localhost:3000/testimonials")
  .then(res => res.json())
  .then(data => {
    data.forEach(addTestimonial);
    duplicateTestimonialsAndStartScroll();
  });

function duplicateTestimonialsAndStartScroll() {
  // Duplicate testimonials for infinite scroll
  const testimonials = Array.from(container.children);
  testimonials.forEach(t => {
    const clone = t.cloneNode(true);
    container.appendChild(clone);
  });

  scrollTestimonials();
}

function scrollTestimonials() {
  if (!isPaused) {
    scrollPosition -= scrollSpeed;

    const resetPoint = container.scrollWidth / 2;
    if (Math.abs(scrollPosition) >= resetPoint) {
      scrollPosition = 0;
    }

    container.style.transform = `translateX(${scrollPosition}px)`;
  }
  requestAnimationFrame(scrollTestimonials);
}

// Pause/resume scroll on hover
container.addEventListener("mouseenter", () => {
  isPaused = true;
});

container.addEventListener("mouseleave", () => {
  isPaused = false;
});

// Handle form submission (if needed)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const response = await fetch("http://localhost:3000/submit", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  addTestimonial(data); // Add immediately to container

  // Duplicate testimonials again for infinite scroll effect
  container.innerHTML = ''; // Clear all
  fetch("http://localhost:3000/testimonials")
    .then(res => res.json())
    .then(data => {
      data.forEach(addTestimonial);
      duplicateTestimonialsAndStartScroll();
    });

  form.reset();
});



// Add scroll reveal animation for resource items
const revealOnScroll = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
};

const resourceObserver = new IntersectionObserver(revealOnScroll, {
  threshold: 0.2,
  rootMargin: "50px",
});

document.querySelectorAll(".resource-item").forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(20px)";
  item.style.transition = "all 0.6s ease-out";
  resourceObserver.observe(item);
});

// Apply button interaction
document.querySelector(".apply-btn").addEventListener("click", () => {
  alert("Redirecting to application form...");
});

// CTA buttons interaction
document.querySelectorAll(".cta-btn").forEach((button) => {
  button.addEventListener("click", () => {
    alert(
      "Thank you for your interest! Redirecting to the registration page..."
    );
  });
});
// Newsletter subscription
const subscribeForm = document.querySelector(".subscribe-form");
subscribeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = subscribeForm.querySelector("input").value;
  if (email) {
    alert("Thank you for subscribing! You will receive our newsletter soon.");
    subscribeForm.querySelector("input").value = "";
  }
});
