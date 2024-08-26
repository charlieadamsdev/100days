document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', handleRegister);
});

function handleRegister(event) {
    event.preventDefault();
    const username = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Here you would typically send a request to your server to register the user
    // For now, we'll just store the user data in localStorage
    const userData = { username, email, password };
    localStorage.setItem('userData', JSON.stringify(userData));
    alert("Registration successful! Please log in.");
    window.location.href = 'login.html';
}
