const apiKey = 'd32b1f09254ef5fbaefebee845af2dc2';
const moviesContainer = document.getElementById('movies');
const heroSection = document.querySelector('.hero');
const BGposters = document.querySelector('.posters-section');
const topRatedList = document.getElementById('top-rated-list');

async function fetchMovies() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
    const data = await res.json();
    console.log(data)
    console.log(data.results)
    displayMovies(data.results.slice(0, 8)); 

    // Set hero background to first movie backdrop
    if (data.results.length > 0) {
      // Generate posters for the poster section
      BGposters.innerHTML = data.results.slice(0, 3).map(movie => {
        return `<div class="poster overflow-hidden">
                  <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                  <div class="poster-title">${movie.title}</div>
                </div>`;
      }).join('');
      
      // Set initial hero background
      let currentIndex = 0;
      updateHeroBackground();
      
      // Set up slideshow for hero background (changes every 2 seconds)
      setInterval(() => {
        currentIndex = (currentIndex + 1) % 3;
        updateHeroBackground();
      }, 2000);
      
      // Function to update the hero background
      function updateHeroBackground() {
        const backdrop = data.results[currentIndex].backdrop_path;
        heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdrop})`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        heroSection.style.backgroundRepeat = 'no-repeat';
        
        // Optional: you could also update a title or information about the current movie
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
          heroTitle.textContent = data.results[currentIndex].title;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = movies.map(movie => {
    const liked = localStorage.getItem(`liked_${movie.id}`) === 'true';
    return `
      <div class="movie-card bg-gray-900 cursor-pointer rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="object-contain mt-6 h-auto p-4 rounded-[5%] mx-auto"  />
        
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-1 flex justify-between">${movie.title} <span class="bg-black text-white font-bold p-[2%] rounded-[13%]">${movie.original_language}</span></h3>
          <p class="text-sm text-gray-400 mb-2">${movie.release_date}</p>
          <p class="text-sm text-gray-300">${movie.overview.substring(0, 100)}...</p>
          <button class="mt-3 like-btn text-pink-500 hover:text-pink-400" data-id="${movie.id}">
            <i class="fas fa-heart ${liked ? 'text-pink-500' : 'text-gray-400'}"></i> <span>${liked ? '♥ Liked' : '♡ Like'}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners after creating the elements
  addLikeButtonListeners();
}

function addLikeButtonListeners() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const movieId = btn.dataset.id;
      const isLiked = localStorage.getItem(`liked_${movieId}`) === 'true';
      localStorage.setItem(`liked_${movieId}`, !isLiked);
      
      // Update UI without reloading all movies
      const span = btn.querySelector('span');
      const icon = btn.querySelector('i');
      
      if (!isLiked) {
        span.textContent = '♥ Liked';
        icon.classList.remove('text-gray-400');
        icon.classList.add('text-pink-500');
      } else {
        span.textContent = '♡ Like';
        icon.classList.remove('text-pink-500');
        icon.classList.add('text-gray-400');
      }
    });
  });
}

async function fetchTopRatedMovies() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`);
    const data = await res.json();
    displayTopRated(data.results.slice(0, 5)); 
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
  }
}

function displayTopRated(movies) {
  topRatedList.innerHTML = movies.map((movie, index) => `
    <div class="flex-shrink-0 w-64 bg-gray-800 rounded-lg p-4 shadow hover:bg-gray-700 transition duration-300">
      <div class="flex items-center mb-3">
        <span class="text-xl font-bold mr-2">${index + 1}.</span>
        <img src="https://image.tmdb.org/t/p/w92${movie.poster_path}" alt="${movie.title}" class="w-16 h-24 object-cover rounded">
      </div>
      <div>
        <h3 class="text-lg font-semibold truncate">${movie.title}</h3>
        <p class="text-sm text-gray-400">⭐ ${movie.vote_average.toFixed(1)}</p>
      </div>
    </div>
  `).join('');
}

fetchTopRatedMovies();


// Initialize the page
fetchMovies();

