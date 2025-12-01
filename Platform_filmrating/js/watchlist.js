(function () {
  'use strict';

  const watchlistContainer = document.getElementById('watchlistContainer');
  if (!watchlistContainer) return;

  const moviesData = {
    "movie_001": {
      title: "Avatar",
      fulltitle: "Avatar Fire and Ash",
      genre: "Epic Science Fiction / Action-Adventure / Fantasy",
      thumb: "../assets/image/avatar thumbnail.png",
      wiki: "https://en.wikipedia.org/wiki/Avatar_(2009_film)",
      date: "December 19, 2025"
    },
    "movie_002": {
      title: "Interstellar",
      fulltitle: "Interstellar: Beyond the Stars",
      genre: "Sci-Fi / Drama / Adventure",
      thumb: "../assets/image/interstellar thumbnail.png",
      wiki: "https://en.wikipedia.org/wiki/Interstellar_(film)",
      date: "November 7, 2014"
    },
    "movie_003": {
      title: "Maze Runner",
      fulltitle: "Maze Runner: The Death Cure",
      genre: "Action / Sci-Fi / Thriller",
      thumb: "../assets/image/mzthumbnail.png",
      wiki: "https://en.wikipedia.org/wiki/Maze_Runner:_The_Death_Cure",
      date: "January 26, 2018"
    }
  };

  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  function showToast(message) {
    const node = document.createElement('div');
    node.className = 'cr-toast';
    node.textContent = message;
    Object.assign(node.style, {
      position: 'fixed',
      right: '16px',
      bottom: '22px',
      background: 'rgba(20,20,20,0.9)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '6px',
      zIndex: 9999,
      fontSize: '13px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
      opacity: 0,
      transition: 'opacity 0.25s ease'
    });
    document.body.appendChild(node);
    requestAnimationFrame(() => { node.style.opacity = 1; });
    setTimeout(() => { node.style.opacity = 0; setTimeout(() => node.remove(), 250); }, 2200);
  }

  function renderWatchlist() {
    watchlistContainer.innerHTML = '';

    if (!watchlist.length) {
      watchlistContainer.innerHTML = '<p class="empty-message">Your watchlist is empty.</p>';
      return;
    }

    watchlist.forEach(id => {
      const movie = moviesData[id];
      if (!movie) return;

      const box = document.createElement('div');
      box.className = 'movie-box';
      box.innerHTML = `
        <img src="${movie.thumb}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>${movie.genre}</p>
        <p><small>Release: ${movie.date}</small></p>
        <div class="box-buttons">
          <a href="${movie.wiki}" target="_blank" class="wiki-btn">Wikipedia</a>
          <button class="remove-btn">Remove</button>
        </div>
      `;

      const removeBtn = box.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => {
        const index = watchlist.indexOf(id);
        if (index !== -1) {
          watchlist.splice(index, 1);
          localStorage.setItem('watchlist', JSON.stringify(watchlist));
          renderWatchlist();
          showToast(`${movie.title} removed from Watchlist`);
        }
      });

      watchlistContainer.appendChild(box);
    });
  }

  renderWatchlist();
})();
