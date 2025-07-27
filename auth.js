alert("✅ auth.js loaded");

async function sendLogin(emailId, passwordId) {
  const email = document.getElementById(emailId).value.trim();
  const password = document.getElementById(passwordId).value.trim();
  if (!email || !password) return alert('❗ Fill all fields');

  alert("🔐 Sending login request...");
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(`📦 Server: ${JSON.stringify(data)}`);
    if (res.ok && data.token) {
      localStorage.setItem('authToken', data.token);
      alert('✅ Login successful');
      window.location.href = 'main.html';
    } else {
      alert(`❌ Login failed: ${data.msg}`);
    }
  } catch (err) {
    alert(`🚨 Error: ${err.message}`);
  }
}

document.getElementById('loginscreen-login-btn')?.addEventListener('click', () => {
  sendLogin('login-email', 'login-password');
});

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  sendLogin('loginFormEmail', 'loginFormPassword');
});

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { username, email, password } = e.target;
  if (!username.value.trim() || !email.value.trim() || !password.value.trim())
    return alert('❗ Fill all fields');

  const res = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value.trim()
    })
  });

  const data = await res.json();
  alert(data.msg);
  if (res.ok) {
    document.getElementById('signup-overlay').classList.add('hidden');
    document.getElementById('login-overlay').classList.remove('hidden');
  }
});

document.getElementById('forgotForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  if (!email) return alert('❗ Fill email');

  const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  alert(data.msg);
});
