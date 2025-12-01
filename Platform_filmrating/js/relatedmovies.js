// Wait until the page fully loads
document.addEventListener('DOMContentLoaded', () => {
  // Grab the ⨂ icon by its ID
  const relatedBtn = document.getElementById('relatedBtn');

  if (!relatedBtn) {
    console.error("Error: relatedBtn icon not found!");
    return;
  }

  // Add click listener to redirect
  relatedBtn.addEventListener('click', () => {
    // Redirect to the similar movies page
   window.location.href = '../relatedmovies.html';
  });
});
