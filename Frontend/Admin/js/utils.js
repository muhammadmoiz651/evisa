/**
 * Utility functions for the admin panel
 */

// DOM helper functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto-remove
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Validate form fields
function validateField(field, rules) {
  const value = field.value.trim();
  let error = null;
  
  if (rules.required && !value) {
    error = 'This field is required';
  } else if (rules.email && value && !isValidEmail(value)) {
    error = 'Please enter a valid email address';
  } else if (rules.minLength && value.length < rules.minLength) {
    error = `Must be at least ${rules.minLength} characters`;
  } else if (rules.pattern && value && !rules.pattern.test(value)) {
    error = rules.patternMessage || 'Invalid format';
  }
  
  return error;
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Debounce function
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create pagination controls
function createPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationElement = document.createElement('div');
  paginationElement.className = 'pagination';
  
  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '&laquo;';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));
  paginationElement.appendChild(prevBtn);
  
  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.classList.toggle('active', i === currentPage);
    pageBtn.addEventListener('click', () => onPageChange(i));
    paginationElement.appendChild(pageBtn);
  }
  
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '&raquo;';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));
  paginationElement.appendChild(nextBtn);
  
  return paginationElement;
}

// Show modal
function showModal(title, content) {
  $('#modalTitle').textContent = title;
  $('.modal-body').innerHTML = '';
  
  if (typeof content === 'string') {
    $('.modal-body').innerHTML = content;
  } else {
    $('.modal-body').appendChild(content);
  }
  
  $('#modal').classList.add('show');
}

// Hide modal
function hideModal() {
  $('#modal').classList.remove('show');
}

// Create form from schema
function createForm(schema, initialData = {}, onSubmit) {
  const form = document.createElement('form');
  
  // Create form fields
  Object.entries(schema).forEach(([fieldName, field]) => {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    
    const label = document.createElement('label');
    label.setAttribute('for', fieldName);
    label.textContent = field.label;
    formGroup.appendChild(label);
    
    let input;
    
    if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'form-control';
      
      if (field.options) {
        field.options.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option.value;
          optionElement.textContent = option.label;
          input.appendChild(optionElement);
        });
      }
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'form-control';
      input.rows = field.rows || 3;
    } else if (field.type === 'checkbox') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'form-check-input';
      input.checked = initialData[fieldName] || false;
    } else {
      input = document.createElement('input');
      input.type = field.type || 'text';
      input.className = 'form-control';
    }
    
    input.id = fieldName;
    input.name = fieldName;
    
    // Set initial value if available
    if (initialData[fieldName] !== undefined && field.type !== 'checkbox') {
      input.value = initialData[fieldName];
    }
    
    formGroup.appendChild(input);
    
    // Add error message container
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.display = 'none';
    errorElement.style.color = 'var(--danger-color)';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '4px';
    formGroup.appendChild(errorElement);
    
    form.appendChild(formGroup);
  });
  
  // Form actions
  const formActions = document.createElement('div');
  formActions.className = 'form-actions';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn light';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', hideModal);
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn primary';
  submitBtn.textContent = initialData.id ? 'Update' : 'Create';
  
  formActions.appendChild(cancelBtn);
  formActions.appendChild(submitBtn);
  form.appendChild(formActions);
  
  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Validate form
    let isValid = true;
    const formData = {};
    
    Object.entries(schema).forEach(([fieldName, field]) => {
      const input = form.elements[fieldName];
      const errorElement = input.parentElement.querySelector('.error-message');
      
      if (field.type === 'checkbox') {
        formData[fieldName] = input.checked;
      } else {
        formData[fieldName] = input.value.trim();
      }
      
      if (field.validation) {
        const error = validateField(input, field.validation);
        
        if (error) {
          errorElement.textContent = error;
          errorElement.style.display = 'block';
          isValid = false;
        } else {
          errorElement.style.display = 'none';
        }
      }
    });
    
    if (isValid && onSubmit) {
      // If there's an existing ID, pass it along
      if (initialData.id) {
        formData.id = initialData.id;
      }
      
      onSubmit(formData);
    }
  });
  
  return form;
}