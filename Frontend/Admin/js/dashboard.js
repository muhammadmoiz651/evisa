async function updateCount(apiUrl, elementId) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      document.getElementById(elementId).textContent = data.length;
    } catch (error) {
      console.error(`Error fetching data from ${apiUrl}:`, error);
      document.getElementById(elementId).textContent = "0";
    }
  }

  // Call the function for each API
  updateCount('/api/users', 'userCount');
  // updateCount('/scholarshipsapi', 'scholarshipCount');
  // updateCount('/universitiesapi', 'universityCount');



// Function to fetch application data
async function fetchApplications() {
  try {
    const response = await fetch('/applications'); 
    const data = await response.json();

    const applicationsTableBody = document.querySelector('#applicationsTable tbody');
    applicationsTableBody.innerHTML = '';

    if (data.length === 0) {
      applicationsTableBody.innerHTML = '<tr><td colspan="6">No applications found</td></tr>';
      return;
    }

    data.forEach(app => {
      const row = `
        <tr>
          
          <td>${app.name}</td>
          <td>${app.email}</td>
          <td>${app.university_name}</td>
          <td>${app.program_type}</td>
          <td>${new Date(app.applied_at).toLocaleString()}</td>
        </tr>
      `;
      applicationsTableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
}

// Dashboard ke load hote he applications load kro
document.addEventListener('DOMContentLoaded', fetchApplications);



document.addEventListener('DOMContentLoaded', function() {
  // Initialize the dashboard
 

  
  
  // Function to update counts (universities, users, etc.)
  function updateCounts() {
    const counts = DataStore.getCounts();  // DataStore should be a centralized storage of counts
    
    // Update count numbers with animation
    Object.keys(counts).forEach(key => {
      const cards = document.querySelectorAll('.card');
      let countElement = null;
      cards.forEach(card => {
        const h3 = card.querySelector('.card-info h3');
        if (h3 && h3.textContent.includes(key.charAt(0).toUpperCase() + key.slice(1))) {
          countElement = card.querySelector('.count');
        }
      });
      
      if (countElement) {
        // Set initial value
        countElement.textContent = '0';
        
        // Animate count up
        const targetValue = counts[key];
        let currentValue = 0;
        const duration = 1000; // ms
        const increment = targetValue / (duration / 16); // 60fps
        
        countElement.classList.add('animate');
        
        const interval = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            clearInterval(interval);
            currentValue = targetValue;
          }
          countElement.textContent = Math.floor(currentValue);
        }, 16);
      }
    });
  }
  
  // Function to update recent activity on the dashboard
  function updateRecentActivity() {
    // Fetch recent activities from the backend or DataStore
    fetch('/recentActivity') // Endpoint to get recent activities
      .then(response => response.json())
      .then(activities => {
        const activityList = document.querySelector('.activity-list');
        
        if (activities.length === 0) {
          activityList.innerHTML = '<p class="empty-state">No recent activity</p>';
          return;
        }
        
        activityList.innerHTML = '';  // Clear any existing activity
        
        activities.forEach(activity => {
          const activityItem = document.createElement('div');
          activityItem.className = 'activity-item';
          
          const iconClass = getActivityIconClass(activity.action);
          
          activityItem.innerHTML = `
            <div class="activity-icon ${activity.action}">
              <i class="fas ${iconClass}"></i>
            </div>
            <div class="activity-content">
              <p>${formatActivityMessage(activity)}</p>
              <span class="activity-time">${formatActivityTime(activity.timestamp)}</span>
            </div>
          `;
          
          activityList.appendChild(activityItem);
        });
      })
      .catch(error => {
        console.error('Error fetching recent activities:', error);
      });
  }
  
  // Helper function to get the appropriate icon based on action type
  function getActivityIconClass(action) {
    switch (action) {
      case 'create': return 'fa-plus';
      case 'update': return 'fa-edit';
      case 'delete': return 'fa-trash';
      default: return 'fa-info-circle';
    }
  }
  
  // Format the activity message for the display
  function formatActivityMessage(activity) {
    return activity.details;
  }
  
  // Format the time for activity
  function formatActivityTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    
    if (diffMin < 1) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // Fetch and display data like universities, users, etc.
  
});
