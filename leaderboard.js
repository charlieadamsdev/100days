import { db, auth } from './firebase-config.js';
import { collection, query, getDocs, where, getDoc, doc, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

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

        let totalLikes = 0;
        completedChallengesSnapshot.forEach(doc => {
            totalLikes += doc.data().likes || 0;
        });

        leaderboardData.push({
            userId: userDoc.id,
            username: userData.username,
            completedNodes: completedChallengesSnapshot.size,
            totalLikes: totalLikes
        });
    }

    leaderboardData.sort((a, b) => {
        if (b.completedNodes !== a.completedNodes) {
            return b.completedNodes - a.completedNodes;
        }
        return b.totalLikes - a.totalLikes;
    });

    leaderboardTable.innerHTML = '';
    leaderboardData.forEach((user) => {
        const row = leaderboardTable.insertRow();
        const usernameCell = row.insertCell(0);
        const nodesCompletedCell = row.insertCell(1);
        const totalLikesCell = row.insertCell(2);

        usernameCell.innerHTML = `<a href="#" class="username-link" data-userid="${user.userId}">${user.username}</a>`;
        nodesCompletedCell.textContent = user.completedNodes;
        totalLikesCell.textContent = user.totalLikes;
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

        const completedChallenges = [];
        completedChallengesSnapshot.forEach(doc => {
            completedChallenges.push({ id: doc.id, ...doc.data() });
        });

        // Sort challenges by day in descending order
        completedChallenges.sort((a, b) => b.day - a.day);

        userChallengesDiv.innerHTML = '';
        completedChallenges.forEach(challenge => {
            const challengeElement = document.createElement('div');
            challengeElement.classList.add('completed-challenge');
            challengeElement.innerHTML = `
                <h3>Day ${challenge.day}</h3>
                <p>${challenge.description}</p>
                ${challenge.imageUrl ? `<img src="${challenge.imageUrl}" alt="Day ${challenge.day} design" style="width: 200px; height: 200px; object-fit: cover;">` : ''}
                <div class="like-container">
                    <button class="like-button" data-challengeid="${challenge.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    <span class="like-count">${challenge.likes || 0}</span>
                </div>
            `;
            userChallengesDiv.appendChild(challengeElement);
        });

        // Add event listeners to like buttons
        const likeButtons = userChallengesDiv.querySelectorAll('.like-button');
        likeButtons.forEach(button => {
            button.addEventListener('click', () => likeChallenge(userId, button.dataset.challengeid));
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

async function likeChallenge(userId, challengeId) {
    const user = auth.currentUser;
    if (!user) {
        console.error('User not authenticated');
        return;
    }

    const challengeRef = doc(db, 'users', userId, 'challenges', challengeId);
    const likeRef = doc(db, 'users', userId, 'challenges', challengeId, 'likes', user.uid);

    try {
        const likeDoc = await getDoc(likeRef);
        if (likeDoc.exists()) {
            console.log('User has already liked this challenge');
            return;
        }

        await runTransaction(db, async (transaction) => {
            const challengeDoc = await transaction.get(challengeRef);
            if (!challengeDoc.exists()) {
                throw "Challenge document does not exist!";
            }

            const newLikes = (challengeDoc.data().likes || 0) + 1;
            transaction.update(challengeRef, { likes: newLikes });
            transaction.set(likeRef, { timestamp: serverTimestamp() });
        });

        console.log('Like added successfully');
        // Update the UI to reflect the new like count
        const likeCountElement = document.querySelector(`[data-challengeid="${challengeId}"]`).nextElementSibling;
        likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
    } catch (error) {
        console.error('Error adding like:', error);
    }
}
