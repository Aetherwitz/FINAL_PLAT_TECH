document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const menuDropdown = document.querySelector('.menu-dropdown');

  if (!menuBtn || !menuDropdown) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    menuDropdown.classList.remove('show');
  });
});
