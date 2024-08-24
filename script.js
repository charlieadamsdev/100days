// Initialize variables
let currentDay = 1;
const totalDays = 100;

// Start the challenge and save the selected category to localStorage
function startChallenge() {
    const category = document.getElementById('category').value;
    localStorage.setItem('category', category);
    localStorage.setItem('currentDay', currentDay);
    window.location.href = "tracker.html";  // Navigate to the tracker page
}

// Load the current challenge from localStorage
function loadChallenge() {
    const day = localStorage.getItem('currentDay') || 1;
    document.getElementById('challenge-day').textContent = `Day ${day}: Complete Task`;
}

// Mark a task as complete and move to the next day
function completeTask() {
    let day = parseInt(localStorage.getItem('currentDay'));
    if (day < totalDays) {
        day += 1;
        localStorage.setItem('currentDay', day);
        loadChallenge();  // Update the tracker page
    } else {
        alert("Challenge Completed!");
    }
}
