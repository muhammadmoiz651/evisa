export function setupFileUpload(inputId, uploadAreaId, previewAreaId, previewImgId) {
  const fileInput = document.getElementById(inputId);
  const uploadArea = document.getElementById(uploadAreaId);
  const previewArea = document.getElementById(previewAreaId);
  const previewImg = document.getElementById(previewImgId);

  // Remove existing event listeners
  const newFileInput = fileInput.cloneNode(true);
  fileInput.parentNode.replaceChild(newFileInput, fileInput);

  const newUploadArea = uploadArea.cloneNode(true);
  uploadArea.parentNode.replaceChild(newUploadArea, uploadArea);

  // Click on upload area opens file dialog
  newUploadArea.addEventListener('click', () => {
    newFileInput.click();
  });

  // Handle file selection
  newFileInput.addEventListener('change', handleFileSelection);

  // Handle drag and drop
  newUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    newUploadArea.classList.add('drag-over');
  });

  newUploadArea.addEventListener('dragleave', () => {
    newUploadArea.classList.remove('drag-over');
  });

  newUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    newUploadArea.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length) {
      newFileInput.files = e.dataTransfer.files;
      handleFileSelection();
    }
  });

  function handleFileSelection() {
    const file = newFileInput.files[0];

    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Display preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      newUploadArea.style.display = 'none';
      previewArea.style.display = 'block';

      // Reset results if they were shown
      const type = inputId.split('-')[0];
      document.getElementById(`${type}-results`).style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}
