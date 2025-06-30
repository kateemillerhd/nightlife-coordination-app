document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = document.getElementById('location').value;
  const barList = document.getElementById('bar-list');
  barList.innerHTML = 'Loading...';

  try {
    const res = await fetch(`/api/search?location=${encodeURIComponent(location)}`);
    const bars = await res.json();

    barList.innerHTML = '';
    for (let bar of bars) {
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
        const bar = bars.find(b => b.id ===yelpId);

        const response = await fetch(`/api/bars/${yelpId}/attend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
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