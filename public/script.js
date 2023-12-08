// get and display top 5 rented movies
fetch('http://localhost:3000/top-5-rented-movies')
  .then(response => response.json())
  .then(movies => {
    const topRentedMovies = document.getElementById('topRentedMovies');
    let table = "<table><tr><th>Title</th><th>Rentals</th></tr>";
    movies.forEach(movie => {
      table += `<tr onclick="getMovieDetails('${movie.title}', '${movie.rental_rate}', '${movie.genres}', '${movie.actors}')"><td>${movie.title}</td><td>${movie.num_rentals}</td></tr>`;
    });
    table += "</table>";
    topRentedMovies.innerHTML = table;
  })
  .catch(error => {
    console.error('Error fetching top 5 rented movies:', error);
  });

fetch('http://localhost:3000/top-actors')
  .then(response => response.json())
  .then(actors => {
    const topActors = document.getElementById('topActors');
    let table = "<table><tr><th>First Name</th><th>Last Name</th><th>Films</th></tr>";
    actors.forEach(actor => {
      table += `<tr onclick="getActorDetails('${actor.first_name}', '${actor.last_name}', '${actor.movies}')"><td>${actor.first_name}</td><td>${actor.last_name}</td><td>${actor.num_films}</td></tr>`;
    });
    table += "</table>";
    topActors.innerHTML = table;
  })
  .catch(error => {
    console.error('Error fetching top 5 actors:', error);
  });

// Display movie details 
function getMovieDetails(title, rentalRate, genres, actors) {
  const movieDetails = document.getElementById('movieDetails');
  let detailsHtml = `<p>Title: ${title}</p>`;
  detailsHtml += `<p>Rental Rate: ${rentalRate}</p>`;
  detailsHtml += `<p>Genres: ${genres}</p>`;
  detailsHtml += `<p>Actors: ${actors}</p>`;
  movieDetails.innerHTML = detailsHtml;
}

// Display actor details
function getActorDetails(firstName, lastName, movies) {
  const actorDetails = document.getElementById('actorDetails');
  let detailsHtml = `<p>First Name: ${firstName}</p>`;
  detailsHtml += `<p>Last Name: ${lastName}</p>`;
  detailsHtml += `<p>Movies: ${movies}</p>`;
  actorDetails.innerHTML = detailsHtml;
}
