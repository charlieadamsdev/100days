import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', handleRegister);
});

async function handleRegister(event) {
    event.preventDefault();
    const username = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            username: username,
            email: email
        });
        alert("Registration successful! Please log in.");
        window.location.href = 'login.html';
    } catch (error) {
        alert("Registration failed: " + error.message);
    }
}