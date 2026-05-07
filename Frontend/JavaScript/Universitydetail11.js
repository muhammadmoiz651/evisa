document.addEventListener("DOMContentLoaded", function () {

  let currentUser = null;           // will hold { name, email }

  const savedEmail = localStorage.getItem('authEmail');
  const savedName = localStorage.getItem('authName');

  if (savedEmail && savedName) {
    currentUser = { name: savedName, email: savedEmail };
  } else {
    console.warn('User data not found in localStorage. Make sure the user is logged in.');
  }


  fetch('/api/details')
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const university = data[10]; // Assuming you want the first university for demonstration

        // University ka name aur location set karna
        document.getElementById("universityName").textContent = university.university_name;
        document.getElementById("location").textContent = university.country_name;
        document.getElementById("universityDescription").textContent = university.guidance;

        // Tags (Programs) set karna
        const tags = document.getElementById("tags");
        const tagItems = university.top_programs
          .split(',')
          .map(tag => `<span>${tag.trim()}</span>`)
          .join('');
        tags.innerHTML = tagItems;



        // Stats Grid
        const statsGrid = document.getElementById("statsGrid");
        statsGrid.innerHTML = `
          <div class="stat-item">
  <span class="stat-number">${university.world_ranking}</span>
  <span class="stat-label">
    <a 
      href="https://www.hu-berlin.de/en/about/humboldt-universitaet-zu-berlin/rankings/qs-world-university-rankings/2024-2025" 
      target="_blank" 
      rel="noopener noreferrer"
      class="qs-link"
    >
      QS World University Ranking
    </a>
  </span>
</div>
          <div class="stat-item">
            <span class="stat-number">25</span>
            <span class="stat-label">Study Programs</span>
          </div>
          
        `;


        // Programs Section with Accordions
        const programsSection = document.getElementById("programsSection");
        programsSection.innerHTML = `
  <div class="accordion-group">
    <div class="accordion-header" id="undergradHeading">
      Undergraduate Programs
      <span class="icon" id="undergradIcon">+</span>
    </div>
    <div id="undergradContainer" class="program-list" style="display: none;"></div>

    <div class="accordion-header" id="masterHeading">
      Master's Programs
      <span class="icon" id="masterIcon">+</span>
    </div>
    <div id="masterContainer" class="program-list" style="display: none;"></div>
  </div>
`;

        // Containers
        const undergradContainer = document.getElementById("undergradContainer");
        const masterContainer = document.getElementById("masterContainer");

        // Define Programs as a string (could come from database or API in real-world scenario)
        const programsString = "Bachelor in Agricultural and Horticultural Sciences , Bachelor in Area Studies Asia/Africa  , Bachelor in Biology  , Bachelor in Biophysics  , Bachelor in Business Administration ,  Bachelor in Chemistry  , Bachelor in Computer Science  , Bachelor in Computer Science, Mathematics and Physics  , Bachelor in Deaf Studies ,  Bachelor in East and Central European Studies ,  Bachelor in Economics  , Bachelor in Geography ,  Bachelor in Islamic Theology ,  Bachelor in Mathematics  , Bachelor in Physics  , Bachelor in Psychology  , Bachelor in Rehabilitation Pedagogy ,  Bachelor in Scandinavian Studies , Bachelor in Social Sciences ,  Bachelor in Sport Science   , M.Sc. in Informatics, M.A. in Information Science, M.Sc. in Integrated Natural Resource Management, M.A. in International Relations";

        // Split programs string into an array and categorize them
        const programs = programsString.split(',').map(p => p.trim());
        const undergradPrograms = programs.slice(0, 20); // First 4 are undergraduate programs
        const masterPrograms = programs.slice(20); // Remaining are master's programs

        // Populate Undergraduate Programs
        undergradPrograms.forEach(program => {
          undergradContainer.innerHTML += `
    <div class="program-item">${program}</div>
  `;
        });
        undergradContainer.innerHTML += `
  <div style="margin-top:10px; text-align: center;">
    <button style="padding: 12px 20px; font-size: 16px; font-weight:bold; background-color: #5d1049; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;" 
      onmouseover="this.style.backgroundColor='#f4c542';" 
      onmouseout="this.style.backgroundColor='#5d1049';" 
      onclick="document.getElementById('appbtn').scrollIntoView({ behavior: 'smooth' });">
      Apply Now
    </button>
  </div>
`;

        // Populate Master's Programs
        masterPrograms.forEach(program => {
          masterContainer.innerHTML += `
    <div class="program-item">${program}</div>
  `;
        });
        masterContainer.innerHTML += `
  <div style="margin-top:10px; text-align: center;">
    <button style="padding: 12px 20px; font-size: 16px; font-weight:bold; background-color: #5d1049; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;" 
      onmouseover="this.style.backgroundColor='#f4c542';" 
      onmouseout="this.style.backgroundColor='#5d1049';" 
      onclick="document.getElementById('appbtn').scrollIntoView({ behavior: 'smooth' });">
      Apply Now
    </button>
  </div>
`;

        // Toggle functionality for accordion headings
        function toggleAccordion(containerId, iconId) {
          const container = document.getElementById(containerId);
          const icon = document.getElementById(iconId);

          if (container.style.display === 'block') {
            container.style.display = 'none';
            icon.textContent = '+';
          } else {
            container.style.display = 'block';
            icon.textContent = '×';
          }
        }

        // Event Listeners to toggle accordions
        document.getElementById("undergradHeading").addEventListener('click', () => {
          toggleAccordion('undergradContainer', 'undergradIcon');
        });

        document.getElementById("masterHeading").addEventListener('click', () => {
          toggleAccordion('masterContainer', 'masterIcon');
        });




        // Deadlines Section
        const deadlinesSection = document.getElementById("deadlinesSection");
        if (university.application_deadlines) {
          const deadlines = university.application_deadlines.split('|').map(item => item.trim());
          deadlinesSection.innerHTML = `
            <p><strong>Application Deadlines:</strong></p>
            <ul>
              ${deadlines.map(d => `<li>${d}</li>`).join('')}
            </ul>
          `;
        } else {
          deadlinesSection.innerHTML = `<p><strong>Application Deadlines:</strong> No deadline available</p>`;
        }

        const universityLogoDiv = document.getElementById('universityLogo');

        if (university.university_image) {
          universityLogoDiv.innerHTML = `<img src="${university.university_image}" alt="${university.university_name} Logo" class="logo-university-img">`;
        }


        // Apply Now Button - Undergraduate
        const applyUndergraduateBtn = document.getElementById('applyUndergraduateBtn');

        if (applyUndergraduateBtn) {
          applyUndergraduateBtn.addEventListener('click', () => {
            if (!currentUser) {
              alert('User information not available. Please log in first.');
              return;
            }

            if (!university?.undergraduate_application_link) {
              alert('Undergraduate application link is not available.');
              return;
            }

            // 1️⃣  Save the application click in the DB
            fetch('/api/apply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: currentUser.name,
                email: currentUser.email,
                university_name: university.university_name,
                program_type: 'Full Degree Program',
              }),
            })
              .then(res => res.json())
              .then(() => {
                // 2️⃣  Then redirect to the university’s application page
                window.location.href = university.undergraduate_application_link;
              })
              .catch(err => {
                console.error('Error submitting application:', err);
                alert('Failed to submit application.');
              });
          });
        }

        /* ───────────  Apply Now – Masters  ─────────── */
        const applyMasterBtn = document.getElementById('applyMasterBtn');

        if (applyMasterBtn) {
          applyMasterBtn.addEventListener('click', () => {
            if (!currentUser) {
              alert('User information not available. Please log in first.');
              return;
            }

            if (!university?.masters_application_link) {
              alert("Master's application link is not available.");
              return;
            }

            // 1️⃣  Save the application click in the DB
            fetch('/api/apply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: currentUser.name,
                email: currentUser.email,
                university_name: university.university_name,
                program_type: 'Master',
              }),
            })
              .then(res => res.json())
              .then(() => {
                // 2️⃣  Then redirect to the university’s application page
                window.location.href = university.masters_application_link;
              })
              .catch(err => {
                console.error('Error submitting application:', err);
                alert('Failed to submit application.');
              });
          });
        }

        // Bookmark Button
        const bookmarkBtn = document.getElementById("bookmarkBtn");
        if (bookmarkBtn) {
          bookmarkBtn.addEventListener('click', () => {
            bookmarkBtn.classList.toggle('bookmarked');
            const isBookmarked = bookmarkBtn.classList.contains('bookmarked');
            const heartIcon = bookmarkBtn.querySelector('.heart-icon');
            heartIcon.textContent = isBookmarked ? '❤️' : '♡';
            alert(isBookmarked ? 'University bookmarked!' : 'Bookmark removed.');
          });
        }

        // Share Button
        const shareBtn = document.querySelector('.share');
        if (shareBtn) {
          shareBtn.addEventListener('click', () => {
            const shareData = {
              title: university.university_name,
              text: `Check out ${university.university_name} for your next study destination!`,
              url: window.location.href,
            };

            if (navigator.share) {
              navigator.share(shareData)
                .then(() => alert('Shared successfully!'))
                .catch((error) => console.error('Error sharing', error));
            } else {
              alert('Sharing is not supported on this device.');
            }
          });
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching university details:", error);
    });
});
