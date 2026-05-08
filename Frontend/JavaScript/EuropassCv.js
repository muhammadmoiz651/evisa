function scrollToForm() {
  document
    .getElementById("cvForm")
    .scrollIntoView({ behavior: "smooth" });
}

function scrollTocv() {
  document
    .getElementById("cvPreview")
    .scrollIntoView({ behavior: "smooth" });
}

document.addEventListener('DOMContentLoaded', function () {
  let selectedTemplate = null;

  // Template Selection
  const templates = document.querySelectorAll('.template');
  templates.forEach(template => {
      template.addEventListener('click', () => {
          templates.forEach(t => t.classList.remove('selected'));
          template.classList.add('selected');
          selectedTemplate = template.dataset.template;
          console.log('Selected Template:', selectedTemplate);
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

  // Profile Photo Upload
  const profilePhoto = document.getElementById('profilePhoto');
  const profilePreview = document.getElementById('profilePreview');

  profilePhoto.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              profilePreview.src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  });

  // Add Experience Field
  const addExperience = document.getElementById('addExperience');
  const experienceFields = document.getElementById('experienceFields');

  addExperience.addEventListener('click', () => {
      const experienceEntry = document.createElement('div');
      experienceEntry.className = 'experience-entry';
      experienceEntry.innerHTML = `
          <input type="text" placeholder="Company Name">
          <input type="text" placeholder="Position">
          <input type="text" placeholder="Duration">
          <textarea placeholder="Description"></textarea>
          <button type="button" onclick="this.parentElement.remove()">Remove</button>
      `;
      experienceFields.appendChild(experienceEntry);
  });

  // Add Education Field
  const addEducation = document.getElementById('addEducation');
  const educationFields = document.getElementById('educationFields');

  addEducation.addEventListener('click', () => {
      const educationEntry = document.createElement('div');
      educationEntry.className = 'education-entry';
      educationEntry.innerHTML = `
          <input type="text" placeholder="Institution">
          <input type="text" placeholder="Degree">
          <input type="text" placeholder="Year">
          <button type="button" onclick="this.parentElement.remove()">Remove</button>
      `;
      educationFields.appendChild(educationEntry);
  });

  // Add Skill Field
  const addSkill = document.getElementById('addSkill');
  const skillsFields = document.getElementById('skillsFields');

  addSkill.addEventListener('click', () => {
      const skillEntry = document.createElement('div');
      skillEntry.className = 'skill-entry';
      skillEntry.innerHTML = `
          <input type="text" placeholder="Skill">
          <input type="range" min="0" max="100" value="50">
          <button type="button" onclick="this.parentElement.remove()">Remove</button>
      `;
      skillsFields.appendChild(skillEntry);
  });

  // Save Data to Database
  async function saveData(data) {
    try {
        console.log('Saving data:', data);
        const response = await fetch(`${window.location.origin}/cv-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log('Server response:', result);

        if (response.ok) {
            console.log('Data saved successfully!');
        } else {
            console.error('Failed to save data. Status:', response.status);
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

  // Preview CV Button
  const previewCV = document.getElementById('previewCV');
  const cvPreview = document.getElementById('cvPreview');

  previewCV.addEventListener('click', async () => {
      if (!selectedTemplate) {
          alert('Please select a template first!');
          return;
      }

      const formData = {
          fullName: document.getElementById('fullName').value,
          title: document.getElementById('title').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          about: document.getElementById('about').value,
          photo: profilePreview.src,
          experiences: Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
              company: entry.querySelector('input:nth-child(1)').value,
              position: entry.querySelector('input:nth-child(2)').value,
              duration: entry.querySelector('input:nth-child(3)').value,
              description: entry.querySelector('textarea').value,
          })),
          education: Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
              institution: entry.querySelector('input:nth-child(1)').value,
              degree: entry.querySelector('input:nth-child(2)').value,
              year: entry.querySelector('input:nth-child(3)').value,
          })),
          skills: Array.from(document.querySelectorAll('.skill-entry')).map(entry => ({
              name: entry.querySelector('input[type="text"]').value,
              level: entry.querySelector('input[type="range"]').value,
          })),
      };

      // Save data to database
      await saveData(formData);

      // Generate preview
      generatePreview(formData, selectedTemplate);

      // Show CV preview
      cvPreview.classList.add('active');
  });

  // Download CV Button
  const downloadCV = document.getElementById('downloadCV');

  downloadCV.addEventListener('click', async () => {
      if (!cvPreview.classList.contains('active')) {
          alert('Please preview your CV first!');
          return;
      }

      // Wait for images to properly load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Convert the CV content to PDF and download
      html2pdf()
          .from(cvPreview)
          .set({
              margin: 1,
              filename: 'CV.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true, logging: true },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          })
          .save();
  });

  // Generate CV Preview
  function generatePreview(data, template) {
      const cvPreview = document.getElementById('cvPreview');
      let previewHTML = '';

      if (template === 'dark') {
          previewHTML = `
              <div class="cv-preview-content">
                  <div class="cv-left-section">
                      <img src="${data.photo}" alt="Profile Photo" class="preview-photo">
                      
                      <div class="about-section">
                          <h3 class="left-section-title">About Me</h3>
                          <p>${data.about}</p>
                      </div>

                      <div class="contact-info">
                          <h3 class="left-section-title">Contact</h3>
                          <div class="contact-item">
                              <span>📧</span>
                              <span>${data.email}</span>
                          </div>
                          <div class="contact-item">
                              <span>📱</span>
                              <span>${data.phone}</span>
                          </div>
                      </div>

                      <div class="expertise-section">
                          <h3 class="left-section-title">Expertise</h3>
                          <div class="skills-list">
                              ${data.skills.map(skill => `
                                  <div class="skill-item">
                                      <div class="skill-name">
                                          <span>${skill.name}</span>
                                          <span>${skill.level}%</span>
                                      </div>
                                      <div class="skill-bar">
                                          <div class="skill-level" style="width: ${skill.level}%"></div>
                                      </div>
                                  </div>
                              `).join('')}
                          </div>
                      </div>
                  </div>

                  <div class="cv-right-section">
                      <div class="cv-header">
                          <div class="cv-name">${data.fullName}</div>
                          <div class="cv-title">${data.title}</div>
                      </div>

                      <div class="experience-section">
                          <h3 class="section-title">Experience</h3>
                          ${data.experiences.map(exp => `
                              <div class="experience-item">
                                  <h4>${exp.position}</h4>
                                  <div class="company-name">${exp.company}</div>
                                  <div class="duration">${exp.duration}</div>
                                  <p>${exp.description}</p>
                              </div>
                          `).join('')}
                      </div>

                      <div class="education-section">
                          <h3 class="section-title">Education</h3>
                          ${data.education.map(edu => `
                              <div class="education-item">
                                  <h4>${edu.degree}</h4>
                                  <div class="institution">${edu.institution}</div>
                                  <div class="year">${edu.year}</div>
                              </div>
                          `).join('')}
                      </div>
                  </div>
              </div>
          `;
      } else if (template === 'light') {
          previewHTML = `
              <div class="cv-preview-content light">
                  <div class="cv-header-light">
                      <div class="profile-section">
                          <img src="${data.photo}" alt="Profile Photo" class="preview-photo-light">
                          <div class="header-text">
                              <h1>${data.fullName}</h1>
                              <h2>${data.title}</h2>
                          </div>
                      </div>
                  </div>

                  <div class="cv-body-light">
                      <div class="left-panel">
                          <div class="contact-section">
                              <div class="contact-item-light">
                                  <span class="icon">📱</span>
                                  <span>${data.phone}</span>
                              </div>
                              <div class="contact-item-light">
                                  <span class="icon">📧</span>
                                  <span>${data.email}</span>
                              </div>
                          </div>

                          <div class="section">
                              <h3>Education</h3>
                              ${data.education.map(edu => `
                                  <div class="education-item-light">
                                      <h4>${edu.degree}</h4>
                                      <p>${edu.institution}</p>
                                      <p class="year">${edu.year}</p>
                                  </div>
                              `).join('')}
                          </div>

                          <div class="section">
                              <h3>Skills</h3>
                              ${data.skills.map(skill => `
                                  <div class="skill-item-light">
                                      <p>${skill.name}</p>
                                  </div>
                              `).join('')}
                          </div>
                      </div>

                      <div class="right-panel">
                          <div class="section">
                              <h3>About Me</h3>
                              <p>${data.about}</p>
                          </div>

                          <div class="section">
                              <h3>Work Experience</h3>
                              ${data.experiences.map(exp => `
                                  <div class="experience-item-light">
                                      <div class="experience-header">
                                          <h4>${exp.position}</h4>
                                          <p class="company">${exp.company}</p>
                                          <p class="duration">${exp.duration}</p>
                                      </div>
                                      <p class="description">${exp.description}</p>
                                  </div>
                              `).join('')}
                          </div>
                      </div>
                  </div>
              </div>
          `;
      }

      cvPreview.innerHTML = previewHTML;
  }
});