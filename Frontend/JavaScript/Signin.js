document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || "Login failed");
        });
      }
      return response.json();
    })
   .then((data) => {
  if (data.message === "Admin login successful") {
    localStorage.setItem('authToken', true);
    localStorage.setItem('authEmail', email);
    localStorage.setItem('role', 'admin');
    window.location.href = "/admin";  // ✅ Admin redirect
  } else if (data.message === "Advisor login successful") {
    localStorage.setItem('authToken', true);
    localStorage.setItem('authEmail', email);
    localStorage.setItem('role', 'advisor');
    window.location.href = "/advisor";  // ✅ Advisor redirect
  } else if (data.message === "Login successful") {
    localStorage.setItem('authToken', true);
    localStorage.setItem('authEmail', email);
     localStorage.setItem('authName', data.name); 
    localStorage.setItem('role', 'user');  // Normal user
    const redirectUrl = localStorage.getItem('redirectAfterLogin') || "/home";
    localStorage.removeItem('redirectAfterLogin');
    window.location.href = redirectUrl;
  } else {
    alert("Invalid credentials");
  }
})

    .catch((error) => {
      alert("Login failed: " + error.message);
    });
  });
});

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateLoginPassword() {
  const password = document.getElementById("password").value;

  const lengthValid = password.length >= 8;
  const uppercaseValid = /[A-Z]/.test(password);
  const numberValid = /\d/.test(password);
  const specialValid = /[@#$%^&*!]/.test(password);

  document.getElementById("login-length").className = lengthValid ? "valid" : "invalid";
  document.getElementById("login-uppercase").className = uppercaseValid ? "valid" : "invalid";
  document.getElementById("login-number").className = numberValid ? "valid" : "invalid";
  document.getElementById("login-special").className = specialValid ? "valid" : "invalid";
}

function showRules() {
  document.getElementById("login-password-rules-container").style.display = "block";
}

function hideRules() {
  document.getElementById("login-password-rules-container").style.display = "none";
}

