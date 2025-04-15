// admin.js

// Fetch results from the server
async function fetchResults() {
  try {
    const res = await fetch('/results');
    const data = await res.json();

    // Render results in the table
    const resultsTable = document.getElementById('results-table');
    resultsTable.innerHTML = ''; // Clear the previous results

    data.forEach(vote => {
      vote.votes.forEach((candidateVote, postIndex) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${vote.voterId}</td>
          <td>Post ${postIndex + 1}</td>
          <td>${candidateVote}</td>
        `;
        resultsTable.appendChild(row);
      });
    });
  } catch (err) {
    console.error('Error fetching results:', err);
  }
}

// CSV Export Function
function exportToCSV() {
  const resultsTable = document.getElementById('results-table');
  const rows = resultsTable.querySelectorAll('tr');
  let csvContent = 'Voter ID,Post Number,Candidate\n';
  
  rows.forEach(row => {
    const columns = row.querySelectorAll('td');
    const rowData = Array.from(columns).map(col => col.innerText).join(',');
    csvContent += rowData + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'results.csv');
  link.click();
}

// Load the results when the page is loaded
window.onload = fetchResults;

// Set up CSV export button click event
document.getElementById('export-csv').addEventListener('click', exportToCSV);
