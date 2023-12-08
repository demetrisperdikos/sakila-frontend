let currentPage = 1;
let currentSearchTerm = '';

function fetchMovies(page, searchTerm = '') {
    fetch(`http://localhost:3000/movies?page=${page}&search=${searchTerm}`)
    .then(response => response.json())
    .then(movies => {
        const movieList = document.getElementById('movieList');
        let listItems = '';
        movies.forEach(movie => {
            listItems += `<li onclick="getMovieDetails(${movie.film_id})">${movie.title}</li>`;
        });
        movieList.innerHTML = listItems;

        currentPage = page;
    })
    .catch(error => {
        console.error('Error fetching movies:', error);
    });
}

function nextPage() {
    fetchMovies(currentPage + 1, currentSearchTerm);
}

function prevPage() {
    if (currentPage > 1) {
        fetchMovies(currentPage - 1, currentSearchTerm);
    }
}

function getMovieDetails(film_id) {
    fetch(`http://localhost:3000/movie-details/${film_id}`)
        .then(response => response.json())
        .then(movie => {
            
            const movieDetails = document.getElementById('movieDetails');
            movieDetails.innerHTML += `<button onclick="rentMovie(${film_id})">Rent Movie</button>`;

            movieDetails.innerHTML = `
            
                <h3>${movie.title}</h3>
                <p>Description: ${movie.description}</p>
                <p>Release Year: ${movie.release_year}</p>
                <p>Language ID: ${movie.language_id}</p>
                <p>Rental Duration: ${movie.rental_duration} days</p>
                <p>Rental Rate: $${movie.rental_rate}</p>
                <p>Length: ${movie.length} minutes</p>
                <p>Replacement Cost: $${movie.replacement_cost}</p>
                <p>Rating: ${movie.rating}</p>
                <p>Actors: ${movie.actors}</p>
                <p>Genres: ${movie.genres}</p>
                <button onclick="rentMovie(${film_id})">Rent Movie</button>

            `;
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
}
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('rent-movie-btn')) {
        const movie_id = event.target.getAttribute('data-movie-id');
        const customer_id = prompt("Enter the Customer ID to rent this movie:");
        if (customer_id) {
            fetch(`http://localhost:3000/rent-movie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movie_id, customer_id }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Movie rented successfully!");
                } else {
                    alert("Failed to rent movie.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }
});

function rentMovie(film_id) {
    const customer_id = prompt("Enter your customer ID:");
    if (customer_id === null) {
      alert("Operation canceled by the user.");
      return;
    }
  
    fetch(`http://localhost:3000/rent-movie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer_id, film_id }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Movie rented successfully!");
      } else {
        alert("An error occurred while renting the movie.");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
function searchMovies() {
    const searchTerm = document.getElementById('movieSearch').value;
    currentSearchTerm = searchTerm;
    fetchMovies(1, searchTerm);
}



document.getElementById('movieSearch').addEventListener('input', searchMovies);

fetchMovies(1);
