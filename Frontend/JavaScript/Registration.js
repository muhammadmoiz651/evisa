document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const successContainer = document.getElementById("successMessage");
  const errorMsg = document.getElementById("error-msg");

  // ✅ Live password validation
  window.checkPassword = function () {
    const password = document.getElementById("password").value;

    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const numberValid = /\d/.test(password);
    const specialValid = /[@#$%^&*!]/.test(password);

    document.getElementById("length").className = lengthValid ? "valid" : "invalid";
    document.getElementById("uppercase").className = uppercaseValid ? "valid" : "invalid";
    document.getElementById("number").className = numberValid ? "valid" : "invalid";
    document.getElementById("special").className = specialValid ? "valid" : "invalid";

    errorMsg.textContent = "";
  };

  // ✅ Final password validation
  function isPasswordValid(password) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[@#$%^&*!]/.test(password)
    );
  }

  // ✅ Email format check
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // ✅ Form submission
  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      // Validate email and password before submitting
      if (!validateEmail(email)) {
        errorMsg.textContent = "Please enter a valid email address.";
        return;
      }

      if (!isPasswordValid(password)) {
        errorMsg.textContent = "Please meet all password requirements.";
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (data.success) {
          successContainer.innerHTML = `
            <div class="success-banner">
              ${data.message}
              <button onclick="window.location.href='https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox'" 
                style="border: 2px solid; border-radius: 10px; background-color: #5D1049; color: white; 
                padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; 
                font-size: 16px; margin: 4px 2px; cursor: pointer;">
                Verify Email
              </button>
            </div>
          `;
          successContainer.style.display = "block";
          signupForm.reset();
          document.querySelectorAll("#password-rules li").forEach(li => li.className = "invalid");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert("Signup failed. Please try again.");
      }
    });
  }



});
  function showPasswordRules() {
  document.getElementById("password-rules-container").style.display = "block";
}

function hidePasswordRules() {
  document.getElementById("password-rules-container").style.display = "none";
}
