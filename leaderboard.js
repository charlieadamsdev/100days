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
        row.classList.add('leaderboard-row');
        row.setAttribute('data-userid', user.userId);
        const usernameCell = row.insertCell(0);
        const nodesCompletedCell = row.insertCell(1);

        usernameCell.textContent = user.username;
        nodesCompletedCell.textContent = user.completedNodes;
    });

    // Add event listeners to rows
    const leaderboardRows = document.querySelectorAll('.leaderboard-row');
    leaderboardRows.forEach(row => {
        row.addEventListener('click', (e) => {
            const userId = e.currentTarget.getAttribute('data-userid');
            showUserChallenges(userId);
        });
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

        const currentUser = auth.currentUser;

        userChallengesDiv.innerHTML = '';
        for (const challenge of completedChallenges) {
            const challengeElement = document.createElement('div');
            challengeElement.classList.add('completed-challenge');
            
            // Check if the current user has liked this challenge
            const likeRef = doc(db, 'users', userId, 'challenges', challenge.id, 'likes', currentUser.uid);
            const likeDoc = await getDoc(likeRef);
            const isLiked = likeDoc.exists();
            const likesCount = challenge.likes || 0;
            
            challengeElement.innerHTML = `
                <h3>Day ${challenge.day}</h3>
                <p>${challenge.description}</p>
                ${challenge.imageUrl ? `<img src="${challenge.imageUrl}" alt="Day ${challenge.day} design" style="width: 200px; height: 200px; object-fit: cover;">` : ''}
                <div class="like-container">
                    <button class="like-button ${isLiked ? 'liked' : ''} ${likesCount === 0 ? 'zero-likes' : ''}" data-challengeid="${challenge.id}">
                        <svg class="like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                        </svg>
                    </button>
                    <span class="like-count">${likesCount}</span>
                </div>
            `;
            userChallengesDiv.appendChild(challengeElement);
        }

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
        await runTransaction(db, async (transaction) => {
            const challengeDoc = await transaction.get(challengeRef);
            if (!challengeDoc.exists()) {
                throw "Challenge document does not exist!";
            }

            const currentLikes = challengeDoc.data().likes || 0;
            if (likeDoc.exists()) {
                // Remove like
                transaction.delete(likeRef);
                transaction.update(challengeRef, { likes: currentLikes - 1 });
            } else {
                // Add like
                transaction.set(likeRef, { timestamp: serverTimestamp() });
                transaction.update(challengeRef, { likes: currentLikes + 1 });
            }
        });

        console.log('Like toggled successfully');
        // Update the UI to reflect the new like count and state
        const likeButton = document.querySelector(`[data-challengeid="${challengeId}"]`);
        const likeCountElement = likeButton.nextElementSibling;
        const newLikesCount = parseInt(likeCountElement.textContent) + (likeDoc.exists() ? -1 : 1);
        likeCountElement.textContent = newLikesCount;
        
        // Update button classes based on new state
        likeButton.classList.toggle('liked', !likeDoc.exists());
        likeButton.classList.toggle('zero-likes', newLikesCount === 0);
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}
