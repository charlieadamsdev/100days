import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

let challengeContainer = null;
let currentDay = 1;

document.addEventListener('DOMContentLoaded', async function() {
    challengeContainer = document.querySelector('.challenge-container');
    
    if (challengeContainer) {
        await loadChallenges();
        renderNodes();
    } else {
        console.error('Challenge container not found');
    }
});

async function loadChallenges() {
    const user = auth.currentUser;
    if (user) {
        const challengesRef = collection(db, 'users', user.uid, 'challenges');
        const q = query(challengesRef, orderBy('day'));
        const querySnapshot = await getDocs(q);
        currentDay = querySnapshot.size + 1;
    }
}

async function renderNodes() {
    challengeContainer.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const node = await createNode(i);
        challengeContainer.appendChild(node);
    }
}

async function createNode(day) {
    const node = document.createElement('div');
    node.classList.add('node');
    
    const user = auth.currentUser;
    if (user) {
        const challengeRef = collection(db, 'users', user.uid, 'challenges');
        const q = query(challengeRef, where('day', '==', day));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const challengeData = querySnapshot.docs[0].data();
            node.classList.add('completed');
            node.innerHTML = `
                <h2>Day ${day}</h2>
                <p>${challengeData.description}</p>
            `;
        } else {
            node.innerHTML = `
                <h2>Day ${day}</h2>
                <p>Challenge description for day ${day}</p>
            `;
        }
    }
    
    return node;
}