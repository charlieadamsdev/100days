// Initialize variables
let currentDay = 1;
const totalDays = 100;
const tasks = {
    design: [
        "Design a landing page for a tech startup",
        "Create a logo for a sportswear brand",
        "Design a login page",
        // Add more tasks for 100 days
    ],
    coding: [
        "Build a simple HTML page",
        "Create a basic JavaScript function",
        "Set up a local server",
        // Add more tasks for 100 days
    ]
};

function startChallenge() {
    const category = document.getElementById('category').value;  // Get selected category
    if (category) {
        localStorage.setItem('category', category);  // Store category in local storage
        localStorage.setItem('currentDay', 1);  // Start from day 1
        window.location.href = "tracker.html";  // Redirect to tracker page
    } else {
        alert("Please select a category");
    }
}


function loadChallenge() {
    const category = localStorage.getItem('category');
    const currentDay = parseInt(localStorage.getItem('currentDay'));

    if (currentDay <= tasks[category].length) {
        document.getElementById('challenge-day').textContent = `Day ${currentDay}`;
        document.getElementById('task').textContent = tasks[category][currentDay - 1];
    } else {
        document.getElementById('challenge-day').textContent = "Challenge Completed!";
        document.getElementById('task').textContent = "";
        document.querySelector('button').style.display = "none"; // Hide the button
    }
}

function completeTask() {
    let currentDay = parseInt(localStorage.getItem('currentDay'));
    currentDay++;
    localStorage.setItem('currentDay', currentDay);
    loadChallenge(); // Refresh the page with the new task
}