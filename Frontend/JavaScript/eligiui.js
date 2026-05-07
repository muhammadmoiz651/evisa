/**
 * UI controller managing the interface interactions
 */
class UIController {
  constructor() {
    // Sections
    this.uploadSection = document.getElementById('uploadSection');
    this.previewSection = document.getElementById('previewSection');
    this.loadingSection = document.getElementById('loadingSection');
    this.resultsSection = document.getElementById('resultsSection');
    this.errorSection = document.getElementById('errorSection');
    
    // Elements
    this.certificateInput = document.getElementById('certificateInput');
    this.fileName = document.getElementById('fileName');
    this.imagePreview = document.getElementById('imagePreview');
    this.backButton = document.getElementById('backButton');
    this.processButton = document.getElementById('processButton');
    this.newUploadButton = document.getElementById('newUploadButton');
    this.tryAgainButton = document.getElementById('tryAgainButton');
    this.errorMessage = document.getElementById('errorMessage');
    
    // Result elements
    this.boardName = document.getElementById('boardName');
    this.totalMarks = document.getElementById('totalMarks');
    this.obtainedMarks = document.getElementById('obtainedMarks');
    this.percentage = document.getElementById('percentage');
    
    // Bind methods
    this.bindEvents();
  }
  
  bindEvents() {
    this.certificateInput.addEventListener('change', this.handleFileSelect.bind(this));
    this.backButton.addEventListener('click', this.goToUpload.bind(this));
    this.processButton.addEventListener('click', this.goToProcessing.bind(this));
    this.newUploadButton.addEventListener('click', this.goToUpload.bind(this));
    this.tryAgainButton.addEventListener('click', this.goToUpload.bind(this));
  }
  
  handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (file) {
      this.fileName.textContent = file.name;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.src = e.target.result;
        this.showSection(this.previewSection);
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName.textContent = 'No file selected';
    }
  }
  
  goToUpload() {
    this.showSection(this.uploadSection);
    this.certificateInput.value = '';
    this.fileName.textContent = 'No file selected';
  }
  
  goToProcessing() {
    this.showSection(this.loadingSection);
    return this.certificateInput.files[0];
  }
  
  showResults(data) {
    // Clear previous results
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = '';

    if (data.certificateType === 'IELTS') {
      // Show IELTS results
      resultsContainer.innerHTML = `
        <div class="result-item">
          <h3>Listening</h3>
          <p class="result-value">${data.listening || '-'}</p>
        </div>
        <div class="result-item">
          <h3>Reading</h3>
          <p class="result-value">${data.reading || '-'}</p>
        </div>
        <div class="result-item">
          <h3>Writing</h3>
          <p class="result-value">${data.writing || '-'}</p>
        </div>
        <div class="result-item">
          <h3>Speaking</h3>
          <p class="result-value">${data.speaking || '-'}</p>
        </div>
        <div class="result-item">
          <h3>Overall Band Score</h3>
          <p class="result-value">${data.overallBand || '-'}</p>
        </div>
      `;
    } else {
      // Show academic results
      resultsContainer.innerHTML = `
        <div class="result-item">
          <h3>Board Name</h3>
          <p class="result-value">${data.boardName || '-'}</p>
        </div>
        <div class="result-item">
          <h3>Total Marks</h3>
          <p class="result-value">${data.totalMarks || '-'}</p>
        </div>
        <div class="result-item">
          <h3>Obtained Marks</h3>
          <p class="result-value">${data.obtainedMarks || '-'}</p>
        </div>
        <div class="result-item">
          <h3>Percentage</h3>
          <p class="result-value">${
            data.totalMarks && data.obtainedMarks 
              ? ((parseInt(data.obtainedMarks) / parseInt(data.totalMarks)) * 100).toFixed(2) + '%'
              : '-'
          }</p>
        </div>
      `;
    }

    // Show eligibility if available
    if (data.eligibility) {
      const eligibilityHtml = this.createEligibilityHtml(data.eligibility);
      resultsContainer.insertAdjacentHTML('beforeend', eligibilityHtml);
    }

    this.showSection(this.resultsSection);
  }

createEligibilityHtml({ scholarships, universities }) {
  const faLink = '<i class="fa-solid fa-arrow-up-right-from-square" style="color:#f4c542;margin-right:8px;"></i>';

  let html = `
  <div class="result-item eligibility-info" style="display:flex;flex-wrap:wrap;gap:2rem;justify-content:flex-start;padding:1.5rem;border:1px solid #ddd;border-radius:16px;background:#fffdf5;box-shadow:0 4px 10px rgba(0,0,0,.05);text-align:left;">
    
    <!-- universities -->
    <div style="flex:1 1 300px;min-width:280px;text-align:left;">
      <h3 style="color:#5d1049;margin-bottom:1rem;font-size:1.4rem;text-align:left;">
        <i class="fa-solid fa-graduation-cap" style="margin-right:8px"></i> Eligible Universities
      </h3>
      <ul style="list-style:none;padding:0;margin:0;">
        ${universities.map(u => {
          const name = typeof u === 'string' ? u : u.name;
          const link = typeof u === 'string' ? '#' : (u.link || '#');
          return `
            <li style="margin-bottom:.75rem;text-align:left;">
              <a href="${link}" target="_blank" style="text-decoration:none;color:#333;font-weight:500;display:inline-flex;align-items:center;">
                ${faLink}${name}
              </a>
            </li>`;
        }).join('')}
      </ul>
    </div>

    <!-- scholarships -->
    <div style="flex:1 1 300px;min-width:280px;text-align:left;">
      <h3 style="color:#5d1049;margin-bottom:1rem;font-size:1.4rem;text-align:left;">
        <i class="fa-solid fa-award" style="margin-right:8px"></i> Available Scholarships
      </h3>
      <ul style="list-style:none;padding:0;margin:0;">
        ${scholarships.map(s => `
          <li style="margin-bottom:.75rem;text-align:left;">
            <a href="${s.link || '#'}" target="_blank" style="text-decoration:none;color:#333;font-weight:500;display:inline-flex;align-items:center;">
              ${faLink}${s.scholarship}
            </a>
          </li>`).join('')}
      </ul>
    </div>

  </div>`;
  return html;
}




  
  showError(message) {
    this.errorMessage.textContent = message;
    this.showSection(this.errorSection);
  }
  
  showSection(section) {
    // Hide all sections
    this.uploadSection.classList.add('hidden');
    this.previewSection.classList.add('hidden');
    this.loadingSection.classList.add('hidden');
    this.resultsSection.classList.add('hidden');
    this.errorSection.classList.add('hidden');
    
    // Show the requested section
    if (section) {
      section.classList.remove('hidden');
      void section.offsetWidth;
    }
  }
}

// Export the UI controller
const uiController = new UIController();