import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase app in login.js:", app);
console.log("Firebase auth in login.js:", auth);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(event) {
    event.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        console.log('Attempting to sign in...');
        console.log('Auth object before sign in:', auth);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Sign-in successful:', userCredential);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error.code, error.message);
        alert('Invalid credentials: ' + error.message);
    }
}