document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.querySelector('.stars');
    const numStars = 250; // Number of stars

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1; // Size range
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        // Adjust animation duration to vary the speed of shooting stars
        star.style.animationDuration = `${Math.random() * 2 + 1}s`; 
        starContainer.appendChild(star);
    }
});
