/**
 * Set up UI interactions
 */
export function setupUI() {
  // Initially show only the upload section
  showSection('uploadSection');
}

/**
 * Show a specific section and hide others
 * @param {string} sectionId - The ID of the section to show
 */
export function showSection(sectionId) {
  // Get all sections
  const sections = ['uploadSection', 'processingSection', 'resultsSection'];
  
  // Hide all sections
  sections.forEach(id => {
    const section = document.getElementById(id);
    section.classList.remove('active');
  });
  
  // Show the specified section
  const sectionToShow = document.getElementById(sectionId);
  sectionToShow.classList.add('active');
  
  // Apply slide-up animation
  sectionToShow.style.animation = 'none';
  setTimeout(() => {
    sectionToShow.style.animation = 'slideUp var(--transition-normal) forwards';
  }, 10);
}

/**
 * Update the processing status message
 * @param {string} message - The status message to display
 */
export function updateProcessingStatus(message) {
  const statusElement = document.getElementById('processingStatus');
  if (statusElement) {
    statusElement.textContent = message;
    
    // Apply animation to the status update
    statusElement.style.animation = 'none';
    setTimeout(() => {
      statusElement.style.animation = 'fadeIn 0.3s';
    }, 10);
  }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
export function showToast(message, type = 'info') {
  // Create toast element if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Add styles for toast container
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '1000';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Style the toast
  toast.style.backgroundColor = type === 'success' ? '#2E8B57' : 
                               type === 'error' ? '#DC3545' : 
                               type === 'warning' ? '#FFA500' : '#5D1049';
  toast.style.color = '#FFFFFF';
  toast.style.padding = '12px 16px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  toast.style.minWidth = '250px';
  toast.style.animation = 'slideUp 0.3s forwards, fadeIn 0.3s forwards';
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s reverse, fadeIn 0.3s reverse';
    setTimeout(() => {
      toastContainer.removeChild(toast);
      
      // Remove container if empty
      if (toastContainer.children.length === 0) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  }, 3000);
}