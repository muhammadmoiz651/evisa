async function fetchScholarshipData() {
  try {
    const response = await fetch('/scholarshipsapi'); 
    if (!response.ok) {
      console.error('Failed to fetch data:', response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Fetched Data:', data); 
    
    // Assuming data might be an array or object, adjust accordingly
    if (data && Array.isArray(data) && data.length > 0) {
      const scholarship = data[6]; 

      // Dynamically set the content
      document.getElementById('scholarship-title').textContent = scholarship.title;
      document.getElementById('scholarship-subtitle').textContent = scholarship.degrees + ' - ' + scholarship.type;
      document.getElementById('deadline-date').textContent = new Date(scholarship.deadline).toLocaleDateString();
      document.getElementById('deadline-date-timeline').textContent = new Date(scholarship.deadline).toLocaleDateString();
      document.getElementById('scholarship-amount').textContent = scholarship.amount || "N/A";
      const applyLink = 'https://concoursens.candidature.onepsl30.fr/servlet/com.jsbsoft.jtf.core.SG?PROC=IDENTIFICATION_FRONT&ACTION=CONNECTER&KUSER_CONNECTOR=1'; 
      const applyNowElement = document.getElementById('apply-now');
      applyNowElement.setAttribute('href', applyLink);
      applyNowElement.setAttribute('target', '_blank'); 
    } else if (data && typeof data === 'object') {
      // If the data is a single object (not in an array)
      const scholarship = data; 
      
      document.getElementById('scholarship-title').textContent = scholarship.title;
      document.getElementById('scholarship-subtitle').textContent = scholarship.degrees + ' - ' + scholarship.type;
      document.getElementById('deadline-date').textContent = new Date(scholarship.deadline).toLocaleDateString();
      
      
    } else {
      console.log('No valid data found');
    }
  } catch (error) {
    console.error('Error fetching scholarship data:', error);
  }
}

// Fetch and display the data when the page loads
window.onload = fetchScholarshipData;
// Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      
      header.addEventListener('click', () => {
        // Close all other accordion items
        const currentlyActive = document.querySelector('.accordion-item.active');
        if (currentlyActive && currentlyActive !== item) {
          currentlyActive.classList.remove('active');
        }
        
        // Toggle current item
        item.classList.toggle('active');
      });
    });
  
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Offset for fixed header
          const offset = 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Animate elements when they enter the viewport
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.card-item, .eligibility-list li, .step-item, .accordion-item');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };
  
    // Set initial styles for animation
    const elementsToAnimate = document.querySelectorAll('.card-item, .eligibility-list li, .step-item, .accordion-item');
    elementsToAnimate.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  
    // Run on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
  
    // Highlight active navigation link based on scroll position
    const highlightActiveNav = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };
  
    
    window.addEventListener('scroll', highlightActiveNav);
  });