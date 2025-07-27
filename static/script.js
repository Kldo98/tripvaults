document.getElementById('trip-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const destination = form.destination.value;
  const people = form.people.value;
  const interests = Array.from(form.interests.selectedOptions).map(opt => opt.value);

  const response = await fetch('/api/travel-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, people, interests })
  });

  const data = await response.json();
  document.getElementById('output').textContent = data.plan || data.error;
});
