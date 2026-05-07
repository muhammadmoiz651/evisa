const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navButtons = document.getElementById('navButtons');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('active');
  navButtons.classList.toggle('active');
  hamburger.textContent = menu.classList.contains('active') ? '✕' : '☰';
});

/**
 * Main application controller
 */
class AppController {
  constructor() {
    // Initialize event listeners
    this.initEvents();
  }
  
  /**
   * Initialize the app event listeners
   */
  initEvents() {
    // Listen for the process button click
    document.getElementById('processButton').addEventListener('click', async () => {
      try {
        // Get the file from the UI controller and start processing
        const file = await uiController.goToProcessing();
        
        if (!file) {
          throw new Error('No file selected');
        }
        
        // Process the image with OCR
        const result = await ocrController.processImage(file);
        
        // Show the results
        uiController.showResults(result);
      } catch (error) {
        console.error('Error processing certificate:', error);
        uiController.showError(error.message || 'Failed to process the certificate');
      }
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AppController();
});