/**
 * Main application script
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const navLinks = $$('.nav-link');
  const sections = $$('.content section');
  const closeModalBtn = $('.close-modal');
  const logoutBtn = $('#logoutBtn');
  
  // Add notification styles
  const notificationStyles = document.createElement('style');
  notificationStyles.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      transform: translateY(-20px);
      opacity: 0;
      transition: all 0.3s ease;
      color: white;
      z-index: 9999;
    }
    
    .notification.success {
      background-color: var(--success-color);
    }
    
    .notification.error {
      background-color: var(--danger-color);
    }
    
    .notification.warning {
      background-color: var(--warning-color);
    }
    
    .notification.info {
      background-color: var(--info-color);
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
  `;
  document.head.appendChild(notificationStyles);
  
  // Initialize tabs
  function initTabs() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetSection = link.dataset.section;
        
        // Update active tab
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update active section
        sections.forEach(section => {
          section.classList.remove('active');
          if (section.id === targetSection) {
            section.classList.add('active');
          }
        });
      });
    });
  }
  
  // Initialize modal
  function initModal() {
    // Close button
    closeModalBtn.addEventListener('click', hideModal);
    
    // Close when clicking outside
    $('#modal').addEventListener('click', (e) => {
      if (e.target === $('#modal')) {
        hideModal();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('#modal').classList.contains('show')) {
        hideModal();
      }
    });
  }
  
  // Add CSS for jQuery-like :contains selector
  function addContainsSelector() {
    Element.prototype.contains = function(text) {
      return this.textContent.includes(text);
    };
  }
  
  // Handle logout
  function handleLogout() {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }
  
  // Initialize application
  function initApp() {
    initTabs();
    initModal();
    addContainsSelector();
    handleLogout();
  }
  
  // Start the application
  initApp();
});