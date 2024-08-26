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

    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData && userData.email === email && userData.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } else if (email === 'user@example.com' && password === 'password') {
        // Keep the test user for development purposes
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials');
    }
}