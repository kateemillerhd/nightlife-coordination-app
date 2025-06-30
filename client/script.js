async function auth(endpoint) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });

  const result = await res.json();
  if (res.ok) {
    document.getElementById('login-status').textContent = `Logged in as ${result.user}`;/
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

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = document.getElementById('location').value;
  const barList = document.getElementById('bar-list');
  barList.innerHTML = 'Loading...';

  try {
    const res = await fetch(`/api/search?location=${encodeURIComponent(location)}`, {
      credentials: 'include'
    });
    const bars = await res.json();

    barList.innerHTML = '';
    for (let bar in bars) {
      const barDiv = document.createElement('div');
      barDiv.innerHTML = `
      <h3>${bar.name}</h3>
      <p>${bar.location}</p>
      <img src="${bar.image_url}" alt="${bar.name}" width="200" />
      <p><a href="${bar.url}" target="_blank">View on Yelp</a></p>
      <button class="attend" data-id="${bar.id}">I'm going</button>
      <div class="status" id="status-${bar.id}"></div>
      `;
      barList.appendChild(barDiv);
    }

    document.querySelectorAll('.attend').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const yelpId = e.target.dataset.id;
        const bar = bars.find(b => b.id === yelpId);

        const response = await fetch(`/api/bars/${yelpId}/attend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(bar)
        });

        const result = await response.json();
        document.getElementById(`status-${yelpId}`).textContent = result.message;
      });
    });
    
  } catch (err) {
    barList.innerHTML = 'Error loading bars';
    console.error(err);
  }
});