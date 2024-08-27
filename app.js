import { firebaseConfig, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

console.log("Using Firebase config in app.js:", firebaseConfig);
console.log("Current auth state:", auth.currentUser);

// Check authentication state
let authCheckComplete = false;
onAuthStateChanged(auth, function(user) {
    console.log("Auth state changed. User:", user);
    if (!authCheckComplete) {
        authCheckComplete = true;
        if (user) {
            console.log("User is signed in:", user.uid);
            document.querySelector('.challenge-container')?.style.display = 'flex';
        } else {
            console.log("No user signed in");
            if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
                window.location.href = 'login.html';
            }
        }
    }
});

// Logout function
window.logout = function() {
    signOut(auth).then(() => {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
}