(() => {
  const movieBox = document.querySelector('#movie-box');
  const reviewTemplate = document.querySelector('#review-template');
  const reviewCon = document.querySelector('#review-con');
  const baseUrl = 'https://swapi.dev/api/';

  function fetchCharacters() {
    fetch(`${baseUrl}people`)
      .then(response => response.json())
      .then(data => {
        if (data.results) {
          data.results.forEach((character, index) => {
            createCharacterCard(character, index + 1);
          });
        } else {
          console.error("No characters found.");
        }
      })
      .catch(err => {
        console.error("Error fetching characters:", err);
        reviewCon.innerHTML = '<p>Error loading characters.</p>';
      });
  }

  function createCharacterCard(character, imageIndex) {
    const card = document.createElement('div');
    card.classList.add('movie-card');

    const img = document.createElement('img');
    img.src = imageForCharacter(imageIndex);
    img.alt = character.name;

    const name = document.createElement('p');
    name.textContent = character.name;

    card.appendChild(img);
    card.appendChild(name);

    card.addEventListener('click', () => fetchMoviesForCharacter(character.films));

    movieBox.appendChild(card);
  }

  function imageForCharacter(index) {
    return `images/character_${index}.jpg`;
  }

  function fetchMoviesForCharacter(filmURLs) {
    reviewCon.innerHTML = '<p>Loading..</p>';

    let movieDetails = [];
    let count = 0;

    filmURLs.forEach(url => {
      fetch(url)
        .then(res => res.json())
        .then(movie => {
          movieDetails.push(movie);
          count++;

          if (count === filmURLs.length) {
            displayMovies(movieDetails);
          }
        })
        .catch(err => {
          console.error("Error fetching movie details:", err);
          reviewCon.innerHTML = '<p>Movie details not available.</p>';
        });
    });
  }

  function displayMovies(movies) {
    reviewCon.innerHTML = '';

    movies.forEach(movie => {
      const clone = reviewTemplate.content.cloneNode(true);
      const reviewHeading = clone.querySelector('.review-heading');
      const reviewDescription = clone.querySelector('.review-description');
      const reviewPoster = clone.querySelector('.review-poster');

      reviewHeading.textContent = movie.title;
      reviewDescription.textContent = movie.opening_crawl;
      reviewPoster.src = moviePoster(movie.title);

      reviewCon.appendChild(clone);
    });
  }

  function moviePoster(title) {
    const posters = {
      "A New Hope": "images/star_wars_a_new_hope.jpg",
      "The Empire Strikes Back": "images/empire_strikes_back.jpg",
      "Return of the Jedi": "images/return_of_the_jedi.jpg",
      "Revenge of the Sith": "images/revenge_of_the_sith.jpg",
      "Attack of the Clones": "images/attack_of_the_clones.jpg",
      "The Phantom Menace" : "images/the_phantom_menace.jpg",
    };

    return posters[title] || "images/default.jpg";
  }

  fetchCharacters();
})();
