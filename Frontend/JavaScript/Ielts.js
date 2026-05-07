const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navButtons = document.getElementById('navButtons');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('active');
  navButtons.classList.toggle('active');
  hamburger.textContent = menu.classList.contains('active') ? '✕' : '☰';
});


function scrollToresources() {
  document
    .getElementById("resources")
    .scrollIntoView({ behavior: "smooth" });
}

// Fetch and render Study Guides from backend
function renderStudyGuides() {
  const container = document.getElementById("guidesContainer");
  fetch("http://localhost:3000/api/study-guides")
    .then((res) => res.json())
    .then((guides) => {
      guides.forEach((guide) => {
        const card = document.createElement("div");
        card.className = "guide-card";
        card.innerHTML = `
          <i class="${guide.icon || 'fas fa-book'}"></i>
          <h3>${guide.title}</h3>
          <p>${guide.description}</p>
          <!-- The download link now opens in a new tab -->
          <a class="download-btn" href="${guide.pdf_file}" target="_blank" rel="noopener noreferrer">
          Download
        </a>
        `;
        container.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Failed to load study guides:", err);
      container.innerHTML = "<p>Error loading study guides. Please try again later.</p>";
    });
}

// Video Tutorials Data
const videoTutorials = [
  {
    videoId: "Mr2f4MxGmA8",
    title: "How to get Band 9 in IELTS",
    description: "A beginner's guide to IELTS Test.",
    duration: "09:48",
    thumbnail: "https://img.youtube.com/vi/Mr2f4MxGmA8/hqdefault.jpg"
  },
  {
    videoId: "D-RuGZD8XbM",
    title: "How to Prepre for IELTS",
    description: "Learn the core concepts of IELTS Test preparation.",
    duration: "16:18",
    thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg"
  },
  {
    videoId: "HDhlXPBXwFA",
    title: "IELTS Complete Course",
    description: "All you need to know about IELETS.",
    duration: "1:00:54",
    thumbnail: "https://img.youtube.com/vi/C0DPdy98e4c/hqdefault.jpg"
  }
];

// Render Video Tutorials
function renderVideoTutorials() {
  const container = document.getElementById("videosContainer");
  videoTutorials.forEach((video) => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-container">
        <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
      </div>
      <div class="video-content">
        <h3>${video.title}</h3>
        <p>${video.description}</p>
        <span class="duration"><i class="far fa-clock"></i> ${video.duration}</span>
        <button class="watch-btn" data-video-id="${video.videoId}">Watch Now</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".watch-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const videoId = e.target.dataset.videoId;
      const parentCard = e.target.closest(".video-card");
      const videoContainer = parentCard.querySelector(".video-container");
      videoContainer.innerHTML = `
        <iframe width="1349" height="480" src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    });
  });
}

// Progress Tracking
function calculateProgress() {
  const scores = {
    reading: parseFloat(document.getElementById('readingScore').value),
    listening: parseFloat(document.getElementById('listeningScore').value),
    writing: parseFloat(document.getElementById('writingScore').value),
    speaking: parseFloat(document.getElementById('speakingScore').value)
  };

  const average = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
  const feedback = document.getElementById('progressFeedback');

  let feedbackHTML = `
    <h3>Your IELTS Progress Report</h3>
    <div class="overall-score">
        <h4>Overall Band Score</h4>
        <div class="score">${average.toFixed(1)}</div>
    </div>
  `;

  Object.entries(scores).forEach(([section, score]) => {
    let feedbackMessage = '';
    if (score >= 7) {
      feedbackMessage = 'Excellent! Keep maintaining this level.';
    } else if (score >= 6) {
      feedbackMessage = 'Good progress. Focus on improving specific skills.';
    } else {
      feedbackMessage = 'Needs improvement. Consider additional practice.';
    }

    feedbackHTML += `
      <div class="score-result">
        <span class="score-label">${section.charAt(0).toUpperCase() + section.slice(1)}</span>
        <span class="score-value">${score.toFixed(1)}</span>
      </div>
      <div class="feedback-message">
        ${feedbackMessage}
      </div>
    `;
  });

  feedback.innerHTML = feedbackHTML;
}

// Initialize All Sections
document.addEventListener("DOMContentLoaded", () => {
  renderStudyGuides();
  renderVideoTutorials();

  document.querySelector(".start-test").addEventListener("click", () => {
    alert("Starting mock test...");
  });

  document.querySelector(".explore-more").addEventListener("click", () => {
    alert("Exploring more resources...");
  });

  // Newsletter
  const newsletterForm = document.querySelector(".newsletter");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector("input").value;
    if (email) {
      alert("Thank you for subscribing!");
      newsletterForm.querySelector("input").value = "";
    }
  });
});
