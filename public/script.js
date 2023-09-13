fetch('http://localhost:3000/health-check')
    .then(response => response.json())
    .then(data => {
        document.getElementById('health-check').textContent = data.message;
    })
    .catch(error => {
        console.error('Error fetching health check:', error);
        document.getElementById('health-check').textContent = 'Error fetching data from backend.';
    });
