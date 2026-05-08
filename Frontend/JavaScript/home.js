function scrollToservices() {
  document.getElementById("ourservices").scrollIntoView({ behavior: "smooth" });
}


 const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active"); // remove class on scroll-out
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((reveal) => {
    observer.observe(reveal);
  });

 const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navButtons = document.getElementById('navButtons');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('active');
  navButtons.classList.toggle('active');
  hamburger.textContent = menu.classList.contains('active') ? '✕' : '☰';
});


document.addEventListener("DOMContentLoaded", function () {
  const chatbotButton = document.querySelector(".chatbot-btn");
  const chatbotWindow = document.getElementById("chatbot-window");
  const closeButton = document.getElementById("close-chatbot");
  const sendButton = document.getElementById("send-message");
  const userMessageInput = document.getElementById("user-message");

  // Open Chatbot Window
  // chatbotButton.addEventListener("click", function () {
  //   chatbotWindow.style.display = "block";
  // });

  // Close Chatbot Window
  // closeButton.addEventListener("click", function () {
  //   chatbotWindow.style.display = "none";
  // });

  // Send Message Functionality (Example)
  sendButton.addEventListener("click", function () {
    const message = userMessageInput.value.trim();
    if (message !== "") {
      const userMessage = document.createElement("p");
      userMessage.textContent = "You: " + message;
      userMessage.style.fontWeight = "bold";

      const botMessage = document.createElement("p");
      botMessage.textContent = "Chatbot: Thank you for your message!";

      const chatBody = document.querySelector(".chatbot-body");
      chatBody.appendChild(userMessage);
      chatBody.appendChild(botMessage);
      userMessageInput.value = "";

      chatBody.scrollTop = chatBody.scrollHeight;
    }
  });
});



const testimonialContainer = document.querySelector(".testimonials-container");

const testimonials = Array.from(testimonialContainer.children);
// Clone original testimonials and append again for seamless scroll
testimonials.forEach(t => {
  const clone = t.cloneNode(true);
  testimonialContainer.appendChild(clone);
});

let scrollPosition = 0;
const scrollSpeed = 0.5; // Adjust speed here

function scrollTestimonials() {
  scrollPosition -= scrollSpeed;

  // Total width of all testimonials (including cloned)
  const totalScrollWidth = testimonialContainer.scrollWidth;

  // Width of half container (original testimonials)
  const resetPoint = totalScrollWidth / 2;

  // Reset scroll position seamlessly once we reach half the width
  if (Math.abs(scrollPosition) >= resetPoint) {
    // Instead of setting to zero, subtract resetPoint to create seamless loop
    scrollPosition += resetPoint;
  }

  testimonialContainer.style.transform = `translateX(${scrollPosition}px)`;
  requestAnimationFrame(scrollTestimonials);
}

scrollTestimonials();

// Pause animation on hover
testimonialContainer.addEventListener("mouseenter", () => {
  testimonialContainer.style.animationPlayState = "paused";
});

testimonialContainer.addEventListener("mouseleave", () => {
  testimonialContainer.style.animationPlayState = "running";
});


const form = document.getElementById("testimonialForm");
const container = document.getElementById("testimonialsContainer");

const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const response = await fetch(`${window.location.origin}/submit`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    addTestimonial(data); // Show immediately
    form.reset();

    // Show success message
    formMessage.textContent = "Testimonial added successfully!";
    formMessage.style.color = "green";
    formMessage.style.display = "block";

    // Hide message after 3 seconds
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 3000);

  } catch (error) {
    formMessage.textContent = "Error adding testimonial. Please try again.";
    formMessage.style.color = "red";
    formMessage.style.display = "block";

    setTimeout(() => {
      formMessage.style.display = "none";
    }, 3000);
  }
});

function addTestimonial(t) {
  const stars = "⭐".repeat(t.rating);
  const html = `
    <div class="testimonial">
      <div class="student-image">
        <img src="${window.location.origin}${t.imageUrl || ''}" alt="Student" />
      </div>
      <p class="quote">"${t.quote}"</p>
      <div class="rating">${stars}</div>
      <p class="student-name">- ${t.name}</p>
    </div>`;
  container.insertAdjacentHTML("afterbegin", html);
}


// Load all testimonials on start
fetch(`${window.location.origin}/testimonials`)
  .then(res => res.json())
  .then(data => data.forEach(addTestimonial));