let challengeContainer = null;
let currentDay = 1;
let isZoomedOut = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initial setup');
    challengeContainer = document.querySelector('.challenge-container');
    
    if (challengeContainer) {
        setupEventListeners();
        arrangeNodesVertically();
        challengeContainer.classList.add('zoomed-in');
    } else {
        console.error('Challenge container not found on initial setup');
    }

    window.onload = function() {
        console.log("Window loaded");
        try {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (!isLoggedIn) {
                window.location.href = 'login.html';
                return;
            }
            currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
            if (challengeContainer) {
                renderNodes();
                updateProgressBar();
                arrangeNodesVertically();
                challengeContainer.classList.add('zoomed-in');
                isZoomedOut = false;
                updateZoomButtonStates();
            } else {
                console.error("Challenge container not found on load");
            }
        } catch (error) {
            console.error("Error during page load:", error);
        }
    };
});

function setupEventListeners() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', zoomIn);
        console.log('Zoom-in event listener added');
    } else {
        console.error('Zoom-in button not found');
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', zoomOut);
        console.log('Zoom-out event listener added');
    } else {
        console.error('Zoom-out button not found');
    }
}

function zoomIn() {
    console.log('Zooming in');
    isZoomedOut = false;
    challengeContainer.classList.remove('zoomed-out');
    challengeContainer.classList.add('zoomed-in');
    arrangeNodesVertically();
    updateZoomButtonStates();
}

function zoomOut() {
    console.log('Zooming out');
    isZoomedOut = true;
    challengeContainer.classList.remove('zoomed-in');
    challengeContainer.classList.add('zoomed-out');
    arrangeNodesInGrid();
    updateZoomButtonStates();
}

function arrangeNodesVertically() {
    console.log('Arranging nodes vertically');
    if (!challengeContainer) {
        console.error('Challenge container not found');
        return;
    }
    const nodes = Array.from(challengeContainer.querySelectorAll('.node-container'));
    if (nodes.length === 0) {
        console.warn('No nodes found to arrange');
        return;
    }
    nodes.sort((a, b) => {
        const dayA = parseInt(a.querySelector('h2')?.textContent?.match(/\d+/)?.[0] || '0');
        const dayB = parseInt(b.querySelector('h2')?.textContent?.match(/\d+/)?.[0] || '0');
        return dayB - dayA;
    });
    
    challengeContainer.innerHTML = '';
    nodes.forEach((node, index) => {
        challengeContainer.appendChild(node);
        if (index < nodes.length - 1) {
            const line = document.createElement('div');
            line.classList.add('connecting-line');
            challengeContainer.appendChild(line);
        }
    });
}

function arrangeNodesInGrid() {
    console.log('Arranging nodes in grid');
    const nodes = Array.from(challengeContainer.querySelectorAll('.node-container'));
    
    challengeContainer.innerHTML = '';
    nodes.forEach((node, index) => {
        const dayNumber = parseInt(node.querySelector('h2').textContent.match(/\d+/)[0]);
        let row = Math.floor((dayNumber - 1) / 5);
        let col = (dayNumber - 1) % 5;
        
        if (row % 2 !== 0) {
            col = 4 - col; // Reverse order for odd rows
        }
        
        node.style.setProperty('--node-row', 20 - row);
        node.style.setProperty('--node-col', col + 1);
        
        challengeContainer.appendChild(node);
    });
}

function updateZoomButtonStates() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    if (zoomInBtn && zoomOutBtn) {
        zoomInBtn.disabled = !isZoomedOut;
        zoomOutBtn.disabled = isZoomedOut;
    }
}

// Include the rest of your functions here (renderNodes, completeTask, restartChallenge, etc.)