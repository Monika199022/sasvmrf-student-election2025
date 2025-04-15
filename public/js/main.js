// main.js

// Get the voting form element
const voteForm = document.getElementById('vote-form');

// List of post names matching the form field names
const postNames = [
  "PRESIDENT",
  "VICE PRESIDENT",
  "SECRETARY",
  "JOINT SECRETARY",
  "TREASURER",
  "JOINT TREASURER",
  "SPORTS SECRETARY",
  "CULTURAL SECRETARY",
  "CLUB REPRESENTATIVE"
];

// Submit vote function
async function submitVote(event) {
  event.preventDefault();

  const voterId = document.getElementById('voterId').value.trim();
  if (!voterId) {
    alert("Please enter your Voter ID.");
    return;
  }

  const votes = {};

  for (const post of postNames) {
    const selected = document.querySelector(`input[name="${post}"]:checked`);
    votes[post] = selected ? selected.value : null;
  }

  try {
    const res = await fetch('/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voterId, votes }),
    });

    if (res.ok) {
      window.location.href = '/thank-you.html';
    } else {
      const msg = await res.text();
      alert(msg || 'You have already voted or an error occurred.');
    }
  } catch (err) {
    console.error('Error submitting vote:', err);
    alert('An error occurred while submitting your vote.');
  }
}

// Set up the vote form submission handler
voteForm.addEventListener('submit', submitVote);
