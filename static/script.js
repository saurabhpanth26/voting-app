// Submit a vote
function submitVote(option) {
    fetch('/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vote: option })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = data.message || data.error;
        fetchResults();  // Update results after voting
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Fetch the current results
function fetchResults() {
    fetch('/results')
        .then(response => response.json())
        .then(data => {
            document.getElementById('option1-votes').textContent = data.option1;
            document.getElementById('option2-votes').textContent = data.option2;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
