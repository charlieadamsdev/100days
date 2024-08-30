import { db, auth } from './firebase-config.js';
import { collection, query, getDocs, where } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

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

        usernameCell.textContent = user.username;
        nodesCompletedCell.textContent = user.completedNodes;
    });
}
