import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

onAuthStateChanged(auth, function(user) {
    if (user) {
        console.log("User is signed in:", user.uid);
        const challengeContainer = document.querySelector('.challenge-container');
        if (challengeContainer) {
            challengeContainer.style.display = 'flex';
        }
    } else {
        console.log("No user signed in");
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
            window.location.href = 'login.html';
        }
    }
});

window.logout = function() {
    signOut(auth).then(() => {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
}