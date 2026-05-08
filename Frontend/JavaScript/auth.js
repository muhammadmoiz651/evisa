const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  // Store token in localStorage
  localStorage.setItem('authToken', token);

  // Decode token to extract name and email
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userName = payload.name;
  const savedEmail = payload.email; // Only if you include email in token

  // Store in localStorage
  localStorage.setItem('authName', userName);
  localStorage.setItem('authEmail', savedEmail);

  // Optional: Clean the URL
  window.history.replaceState({}, document.title, "/home");
}

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    localStorage.setItem('authToken', token);
    window.location.href = "/home";
  }

  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn');
  const createBtn = document.getElementById('createBtn');

 const savedToken = localStorage.getItem('authToken');
const savedEmail = localStorage.getItem('authEmail');

  console.log("Saved email:", savedEmail); 
 

  const currentPath = window.location.pathname;
  const showPopupPages = [
    '/eiffel',
    '/tum',
    '/accommodationdetails',
    '/francevisa',
    '/university/paris-saclay',
    '/university/pantheon-sorbonne',
    '/university/technicaluniversity',
    '/university/ludwig',
    '/university/barcelona',
    '/university/pompeu',
    '/stanforduniversity',
    '/university/ecol',
    '/university/madrid',
    '/university/polytechnic',
    '/university/grenoble',
    '/university/humboldt',
    '/university/heidelberg',
    '/university/politecnica',
    '/university/paris',
    '/university/manhim',
    '/university/ham',
    '/university/ksh',
    '/university/artsmun',
    '/university/hff',
    '/university/mba',
    '/university/mua',
    '/university/hf',
    '/testprepration',
    '/mocktest',
    '/ielts',
    '/europasscv',
    '/idex',
    '/ub',
    '/arts',
    '/upf',
    '/iss',
    '/uga',
    '/uam',
    '/upc',
    '/deut',
    '/schdeuts',
    '/eiffels',
    '/accommodationdetails',
    '/accommodationdetails1',
    '/accommodationdetails2',
    '/accommodationdetails3',
    '/accommodationdetails4',
    '/accommodationdetails5',
    '/accommodationdetails6',
    '/accommodationdetails7',
    '/spainvisa',
    '/germanyvisa',
    '/daad',
    '/kaad',
    '/schmbs',
    '/muascholorship',
    '/eligibilitychecker',
  ];

  const adminPages = ['/admin/'];

  if (adminPages.includes(currentPath)) {
  if (!savedToken || savedEmail !== "raosumeet@gmail.com") {
    alert("Access Denied: You are not authorized to view this page.");
    window.location.href = "/signin";
    return;
  }
}

const advisorPages = ['/advisor'];

const allowedAdvisorEmails = [
  'germany@gmail.com',
  'france@gmail.com',
  'spain@gmail.com'
];

if (advisorPages.includes(currentPath)) {
  if (!savedToken || !allowedAdvisorEmails.includes(savedEmail)) {
    window.location.href = "/signin";
    return;
  }
}


  if (savedToken) {
    showLogoutButton();
    hideLoginPopup();
  } else {
    showLoginAndSignUpButton();
    if (showPopupPages.includes(currentPath)) {
      showLoginPopup();
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      fetch(`${window.location.origin}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.removeItem('authToken');
          showLoginAndSignUpButton(); // Show both login and sign-up buttons again
          showLoginPopup(); // Show popup again after logout
          alert(data.message);
        })
        .catch((error) => {
          alert("Logout failed: " + error.message);
        });
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', function () {
      localStorage.setItem('redirectAfterLogin', window.location.href);
      window.location.href = "/signin";
    });
  }

  if (createBtn) {
    createBtn.addEventListener('click', function () {
      localStorage.setItem('redirectAfterLogin', window.location.href);
      window.location.href = "/registration";
    });
  }

  function showLogoutButton() {
    if (loginBtn) loginBtn.style.display = 'none';
    if (createBtn) createBtn.style.display = 'none'; // Hide Sign Up button
    if (logoutBtn) logoutBtn.style.display = 'block'; // Show logout button
  }

  function showLoginAndSignUpButton() {
    if (loginBtn) loginBtn.style.display = 'block'; // Show Login button
    if (createBtn) createBtn.style.display = 'block'; // Show Sign Up button
    if (logoutBtn) logoutBtn.style.display = 'none'; // Hide logout button
  }

  function showLoginPopup() {
    const popup = document.getElementById('loginPopup');
    if (popup) popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const popupLoginBtn = document.getElementById('popupLoginBtn');
    if (popupLoginBtn) {
      popupLoginBtn.addEventListener('click', function () {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = "/signin";
      });
    }
  }

  function hideLoginPopup() {
    const popup = document.getElementById('loginPopup');
    if (popup) popup.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});
