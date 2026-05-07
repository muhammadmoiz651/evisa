async function fetchAndRenderScholarshipData() {
    try {
      const response = await fetch('/scholarshipsapi');
      const data = await response.json();
      const scholarshipData = data.find(sch => sch.scholarship_id === 4);
  
      // Hero section
      document.querySelector('.hero h1').textContent = scholarshipData.title;
      document.querySelector('.hero .subtitle').textContent = 
        "Supporting international exchange opportunities for Bachelor and Master students";
      document.querySelector('.deadline-banner span').textContent =
        `Application Deadline: ${new Date(scholarshipData.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  
      // Detail Cards
      const details = [
        { icon: 'graduation-cap', title: 'Program Type', value: scholarshipData.type },
        { icon: 'user-graduate', title: 'Level', value: scholarshipData.degrees },
        { icon: 'coins', title: 'Funding', value: scholarshipData.amount }
      ];
  
      const detailsGrid = document.querySelector('.details-grid');
      detailsGrid.innerHTML = details.map(detail => `
        <div class="detail-card">
          <div class="icon"><i class="fas fa-${detail.icon}"></i></div>
          <h3>${detail.title}</h3>
          <p>${detail.value}</p>
        </div>
      `).join('');
  
      // Eligibility List
      const eligibilityList = document.querySelector('.eligibility-list');
      const eligibilityData = [
        { title: "Enrollment Requirement", description: "Enrolled at LMU for at least 2 semesters" },
        { title: "Academic Performance", description: "Excellent academic record" },
        { title: "Financial Status", description: "Monthly income less than €1,200" }
      ];
  
      eligibilityList.innerHTML = eligibilityData.map(item => `
        <li>
          <span class="check-icon"><i class="fas fa-check-circle"></i></span>
          <div>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
          </div>
        </li>
      `).join('');
  
      // FAQs (Accordion)
      const accordion = document.querySelector('.accordion');
      const faqs = [
        {
          question: "What documents are required for application?",
          answer: "Required documents include your transcript of records, motivation letter, CV, and proof of financial status."
        },
        {
          question: "How are recipients selected?",
          answer: "Selection is based on academic merit, motivation, and financial need."
        },
        {
          question: "Can I apply for multiple scholarships?",
          answer: "Yes, you can apply for multiple scholarships, but check each scholarship's terms regarding simultaneous funding."
        }
      ];
  
      accordion.innerHTML = faqs.map(faq => `
        <div class="accordion-item">
          <button class="accordion-button">
            ${faq.question}
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="accordion-content">
            <p>${faq.answer}</p>
          </div>
        </div>
      `).join('');
  
      // Accordion toggle logic
      document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', () => {
          const item = button.parentElement;
          const content = item.querySelector('.accordion-content');
  
          // Close all others
          document.querySelectorAll('.accordion-item').forEach(i => {
            if (i !== item) {
              i.classList.remove('active');
              i.querySelector('.accordion-content').style.maxHeight = null;
            }
          });
  
          // Toggle this one
          item.classList.toggle('active');
          if (item.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = null;
          }
        });
      });
  
    } catch (error) {
      console.error("Error fetching scholarship data:", error);
    }
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderScholarshipData();
  });
  