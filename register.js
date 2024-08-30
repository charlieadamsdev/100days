import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        console.log('Register form found');
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.error('Register form not found');
    }
});

async function handleRegister(event) {
    console.log('handleRegister function called');
    event.preventDefault();
    const username = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;

    console.log('Form data:', { username, email, password, confirmPassword });

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        console.log('Attempting to create user');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created:', userCredential.user.uid);
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            username: username,
            email: email
        });
        console.log('User document created in Firestore');
        
        alert("Registration successful! Please log in.");
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Registration error:', error);
        alert("Registration failed: " + error.message);
    }
}