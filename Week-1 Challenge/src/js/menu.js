document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const favoriteButton = document.getElementById('favorite-button');
    const playMusicButton = document.getElementById('play-music-button');
    const gotTheme = document.getElementById('got-theme');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    favoriteButton.addEventListener('click', () => {
        favoriteButton.classList.toggle('active');
    });

    playMusicButton.addEventListener('click', () => {
        if (gotTheme.paused) {
            gotTheme.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            gotTheme.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });
});