import { db, auth } from './firebase-config.js';
import { collection, query, getDocs, where, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
});

async function loadLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    const leaderboardData = [];

    for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const challengesRef = collection(db, 'users', userDoc.id, 'challenges');
        const completedChallengesQuery = query(challengesRef, where('completed', '==', true));
        const completedChallengesSnapshot = await getDocs(completedChallengesQuery);

        leaderboardData.push({
            userId: userDoc.id,
            username: userData.username,
            completedNodes: completedChallengesSnapshot.size
        });
    }

    leaderboardData.sort((a, b) => b.completedNodes - a.completedNodes);

    leaderboardTable.innerHTML = '';
    leaderboardData.forEach((user) => {
        const row = leaderboardTable.insertRow();
        const usernameCell = row.insertCell(0);
        const nodesCompletedCell = row.insertCell(1);

        usernameCell.innerHTML = `<a href="#" class="username-link" data-userid="${user.userId}">${user.username}</a>`;
        nodesCompletedCell.textContent = user.completedNodes;
    });

    // Add event listeners to username links
    const usernameLinks = document.querySelectorAll('.username-link');
    usernameLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const userId = e.target.getAttribute('data-userid');
            showUserChallenges(userId);
        });
    });
}

async function showUserChallenges(userId) {
    const modal = document.getElementById('user-challenges-modal');
    const modalUsername = document.getElementById('modal-username');
    const userChallengesDiv = document.getElementById('user-challenges');

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        modalUsername.textContent = `${userData.username}'s Completed Challenges`;

        const challengesRef = collection(db, 'users', userId, 'challenges');
        const completedChallengesQuery = query(challengesRef, where('completed', '==', true));
        const completedChallengesSnapshot = await getDocs(completedChallengesQuery);

        userChallengesDiv.innerHTML = '';
        completedChallengesSnapshot.forEach(doc => {
            const challenge = doc.data();
            const challengeElement = document.createElement('div');
            challengeElement.classList.add('completed-challenge');
            challengeElement.innerHTML = `
                <h3>Day ${challenge.day}</h3>
                <p>${challenge.description}</p>
                ${challenge.imageUrl ? `<img src="${challenge.imageUrl}" alt="Day ${challenge.day} design" style="width: 200px; height: 200px; object-fit: cover;">` : ''}
            `;
            userChallengesDiv.appendChild(challengeElement);
        });

        modal.style.display = 'block';
    } else {
        console.error('User not found');
    }

    // Close modal when clicking on the close button
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
