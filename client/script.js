async function auth(endpoint) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const result = await res.json();
  if (res.ok) {
    document.getElementById('login-status').textContent = `Logged in as ${result.user}`;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('search-form').style.display = 'block';
  } else {
    document.getElementById('login-status').textContent = result.error;
  }
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  auth('login');
});

document.getElementById('register-btn').addEventListener('click', () => {
  auth('register');
});