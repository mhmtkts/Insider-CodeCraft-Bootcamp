document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const favoriteButton = document.getElementById('favorite-button');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    favoriteButton.addEventListener('click', () => {
        favoriteButton.classList.toggle('active');
    });
});