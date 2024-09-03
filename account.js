import { auth } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', handleLogout);
});

async function handleLogout() {
    try {
        await signOut(auth);
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out: ', error);
    }
}
