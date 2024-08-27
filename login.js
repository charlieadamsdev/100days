import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(event) {
    event.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error.code, error.message);
        alert('Invalid credentials: ' + error.message);
    }
}