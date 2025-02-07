(() => {
  const movieBox = document.querySelector('#movie-box');
  const reviewTemplate = document.querySelector('#review-template');
  const reviewCon = document.querySelector('#review-con');
  const baseUrl = 'https://swapi.dev/api/';

  function getCharacters() {
    fetch(`${baseUrl}people`)
      .then(response => response.json())
      .then(function (response) {
        const characters = response.results;
        characters.forEach((character, index) => {
          createCharacterCard(character, index + 1); 
        });
      })
      .catch(function (err) {
        console.error(err);
      });
  }


  function createCharacterCard(character, imageIndex) {
   
    const card = document.createElement('div');
    card.classList.add('movie-card');

  
    const img = document.createElement('img');
    img.src = getImageForCharacter(imageIndex);
    img.alt = character.name;


    const name = document.createElement('p');
    name.textContent = character.name;

  
    card.appendChild(img);
    card.appendChild(name);


    card.addEventListener('click', () => getMoviesForCharacter(character.films));

 
    movieBox.appendChild(card);
  }



  function getImageForCharacter(index) {
    return `images/character_${index}.jpg`; 
  }



  function getMoviesForCharacter(filmURLs) {
    reviewCon.innerHTML = '<p>Loading...</p>';

    Promise.all(filmURLs.map(url => fetch(url).then(res => res.json())))
      .then(movies => {
        reviewCon.innerHTML = '';
        movies.forEach(movie => {
          const clone = reviewTemplate.content.cloneNode(true);
          const reviewHeading = clone.querySelector('.review-heading');
          const reviewDescription = clone.querySelector('.review-description');
          const reviewPoster = clone.querySelector('.review-poster'); 

          reviewHeading.innerHTML = movie.title;
          reviewDescription.innerHTML = movie.opening_crawl;
          
   
          reviewPoster.src = getMoviePoster(movie.title);

          reviewCon.appendChild(clone);
        });
      })


      .catch(function (err) {
        console.error(err);
        reviewCon.innerHTML = '<p>Movie details not available.</p>';
      });
  }


  function getMoviePoster(title) {

    const posters = {
      "A New Hope": "images/star_wars_a_new_hope.jpg",
      "The Empire Strikes Back": "images/empire_strikes_back.jpg",
      "Return of the Jedi": "images/return_of_the_jedi.jpg",
      "Revenge of the Sith": "images/revenge_of_the_sith.jpg",
      "Attack of the Clones": "images/attack_of_the_clones.jpg",
    };

 
    return posters[title] || "images/";
  }

  getCharacters();
})();
