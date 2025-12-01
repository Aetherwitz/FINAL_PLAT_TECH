/*
  Refactored UI script (fixed)
  - Menu toggling
  - Watchlist helper
  - Star rating module w/ per-slide state & carousel integration
  - Toast notifications
*/

(function () {
  'use strict';

  // ---- Utilities ----
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qAll = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };

  const writeJSON = (key, val) =>
    localStorage.setItem(key, JSON.stringify(val));

  // ---- Toast ----
  function showToast(message, timeout = 2200) {
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
    setTimeout(() => {
      node.style.opacity = 0;
      setTimeout(() => node.remove(), 250);
    }, timeout);
  }

  // ---- Menu ----
  function initMenu() {
    const menuBtn = q('.menu-btn');
    const dropdown = q('.menu-dropdown');
    if (!menuBtn || !dropdown) return;

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.style.display === 'block';
      dropdown.style.display = open ? 'none' : 'block';
      menuBtn.setAttribute('aria-expanded', !open);
    });

    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
        menuBtn.setAttribute('aria-expanded', false);
      }
    });
  }

  // ---- Watchlist ----
  function initWatchlist() {
    const watchlistBtn = q('#watchlistBtn');
    const movieEl = q('.movie');
    if (!watchlistBtn || !movieEl) return;

    const getWatchlist = () => readJSON('watchlist', []);
    const saveWatchlist = (list) => writeJSON('watchlist', list);

    watchlistBtn.addEventListener('click', () => {
      const id = movieEl.dataset.id;
      const title = movieEl.dataset.title || id;
      if (!id) return showToast('No movie selected');

      const list = getWatchlist();
      if (list.includes(id)) {
        return showToast(`${title} is already in your Watchlist`);
      }
      list.push(id);
      saveWatchlist(list);
      showToast(`${title} added to Watchlist`);
    });
  }

  // ---- Rating ----
  function initRating() {
    const ratingForm = q('.rating-form');
    if (!ratingForm) return;

    const inputs = qAll('input[name="rating"]', ratingForm);
    let labels = qAll('label[for^="star"]', ratingForm);

    // Ensure labels sorted numerically by star value
    labels.sort((a, b) =>
      Number(a.htmlFor.replace('star', '')) -
      Number(b.htmlFor.replace('star', ''))
    );

    const rateBtn = q('.rate-btn', ratingForm);

    const storageKey = (id) => `rating_${id}`;

    // Determine active movie context
    function currentMovieContext() {
      const active = q('.carousel-item.active');
      const block = q('.movie');

      const id =
        active?.dataset.id ??
        block?.dataset.id ??
        null;

      const title =
        active?.dataset.title ??
        block?.dataset.title ??
        id ??
        '';

      return { id, title };
    }

    function highlightStars(value) {
  labels.forEach(label => {
    const val = Number(label.htmlFor.replace('star', ''));
    label.classList.toggle('selected', val >= value);
  });
}


    function refreshForMovie(id) {
      inputs.forEach(i => i.checked = false);
      if (!id) return highlightStars(0);

      const saved = Number(localStorage.getItem(storageKey(id))) || 0;
      if (saved > 0) {
        const input = q(`#star${saved}`);
        if (input) input.checked = true;
      }
      highlightStars(saved);
    }

    // ---- Input change ----
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const v = Number(e.target.value);
        const { id } = currentMovieContext();
        if (!id) return showToast('No movie selected');
        if (!v) return;

        localStorage.setItem(storageKey(id), v);
        highlightStars(v);
      });
    });

    // ---- Hover preview ----
    labels.forEach(label => {
      label.addEventListener('mouseenter', () => {
        const v = Number(label.htmlFor.replace('star', ''));
        highlightStars(v);
      });
      label.addEventListener('mouseleave', () => {
        const { id } = currentMovieContext();
        const saved = Number(localStorage.getItem(storageKey(id))) || 0;
        highlightStars(saved);
      });
    });

    // ---- Rate button ----
    rateBtn?.addEventListener('click', () => {
      const checked = ratingForm.querySelector('input[name="rating"]:checked');
      const { id, title } = currentMovieContext();

      if (!id) return showToast('No movie selected');
      if (!checked) return showToast('Please select a rating first');

      const v = Number(checked.value);
      if (!v) return;

      localStorage.setItem(storageKey(id), v);
      highlightStars(v);
      showToast(`Thanks — you rated ${title} ${v}/5`);
    });

    // ---- Carousel change ----
    window.addEventListener('movieChange', (e) => {
      const d = e?.detail;
      if (!d?.id) return;
      refreshForMovie(d.id);
    });

    // Init
    const ctx = currentMovieContext();
    if (ctx.id) refreshForMovie(ctx.id);
  }

  // ---- Initialization ----
  function initAll() {
    initMenu();
    initWatchlist();
    initRating();
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', initAll);
  else
    initAll();

})();
