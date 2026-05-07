document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px'
    });
  
    // Observe all info cards
    document.querySelectorAll('.info-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  
    // Countdown to deadline
    function updateCountdown() {
      const deadline = new Date('2025-05-31');
      const now = new Date();
      const difference = deadline - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const winterDeadline = document.querySelector('.deadline-item:first-child strong');
        if (winterDeadline) {
          winterDeadline.textContent = `31 May 2025 (${days} days left)`;
        }
      }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60); // Update every hour
  });