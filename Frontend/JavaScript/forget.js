document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.querySelector('input[type="email"]').value;
  
  const response = await fetch('http://localhost:3000/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
  });
  
  const result = await response.json();
  alert(result.message);
});
