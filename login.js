window.onload = function() {
    console.log("Window loaded");
    currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
    if (challengeContainer) {
        renderNodes();
        updateProgressBar();
        arrangeNodesVertically();
        challengeContainer.classList.add('zoomed-in');
        isZoomedOut = false;
        updateZoomButtonStates();
    } else {
        console.error("Challenge container not found on load");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', handleLogin);
});

function handleLogin(event) {
    event.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // Here you would typically send a request to your server to authenticate
    // For now, we'll use a simple check
    if (email === 'user@example.com' && password === 'password') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials');
    }
}