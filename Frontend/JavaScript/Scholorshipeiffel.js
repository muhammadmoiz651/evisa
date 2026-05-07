document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', function() {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        
        // Animate hamburger to X
        const spans = this.querySelectorAll('span');
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    }
    
    // Countdown timer
    const countdownDate = new Date('October 28, 2025 23:59:59').getTime();
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = countdownDate - now;
      
      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Display the result
      document.getElementById('days').textContent = days;
      document.getElementById('hours').textContent = hours;
      document.getElementById('minutes').textContent = minutes;
      document.getElementById('seconds').textContent = seconds;
      
      // If the countdown is over
      if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        
        document.querySelector('.deadline-text').textContent = 'Applications are now closed';
      }
    }
    
    // Update the countdown every second
    updateCountdown();
    const countdownTimer = setInterval(updateCountdown, 1000);
    
    // Testimonial carousel
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
      // Hide all testimonials
      testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
      });
      
      // Show selected testimonial
      testimonials[index].classList.add('active');
      
      // Update dots
      dots.forEach(dot => {
        dot.classList.remove('active');
      });
      dots[index].classList.add('active');
      
      currentTestimonial = index;
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showTestimonial(index);
      });
    });
    
    // Auto-rotate testimonials
    function rotateTestimonials() {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    }
    
    let testimonialTimer = setInterval(rotateTestimonials, 5000);
    
    // Pause rotation on hover
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    
    testimonialCarousel.addEventListener('mouseenter', () => {
      clearInterval(testimonialTimer);
    });
    
    testimonialCarousel.addEventListener('mouseleave', () => {
      clearInterval(testimonialTimer);
      testimonialTimer = setInterval(rotateTestimonials, 5000);
    });
    
    // Download button functionality
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // In a real implementation, this would download an actual PDF
        // For this demo, we'll just show an alert
        alert('The application PDF would begin downloading now.');
        
        // Adding a small animation to indicate the button was clicked
        this.classList.add('clicked');
        
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 300);
      });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for fixed header
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Animated entrance for benefit items
    const benefitItems = document.querySelectorAll('.benefits-list li');
    
    // Simple function to check if an element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    
    // Add animation when scrolled into view
    function animateOnScroll() {
      benefitItems.forEach((item, index) => {
        if (isInViewport(item)) {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, index * 200);
        }
      });
      
      // Animate process steps
      const steps = document.querySelectorAll('.step');
      steps.forEach((step, index) => {
        if (isInViewport(step)) {
          setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
          }, index * 200);
        }
      });
    }
    
    // Set initial styles for animation
    benefitItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
      step.style.opacity = '0';
      step.style.transform = 'translateY(20px)';
      step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Check for animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
  });