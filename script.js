// Initialize variables
console.log("Script loaded");

let currentDay = 1;
const tasks = [
        "Simple Button design",
        "Login Form",
        "Registration Form",
        "Navigation Bar",
        "Simple Footer",
        "Card Layout",
        "Profile Card",
        "Social Media Buttons",
        "Product Grid Layout",
        "Call to Action Section",
        "Search Bar UI",
        "Input Fields & Validation",
        "Simple Modal Window",
        "Progress Bar",
        "Pricing Table",
        "Notification Banner",
        "Responsive Image Gallery",
        "Toggle Switches",
        "Dropdown Menu",
        "Responsive Sidebar Menu",
        "Animated Button Hover Effects",
        "Accordion UI",
        "Interactive Tabs",
        "File Upload UI",
        "Responsive Hero Section",
        "Custom Checkbox & Radio Buttons",
        "Pagination UI",
        "Responsive Form UI",
        "Light/Dark Mode Toggle",
        "Error 404 Page",
        "Sticky Navigation Bar",
        "Step-by-step Form UI",
        "Interactive Checklist UI",
        "Responsive Hamburger Menu",
        "Sliding Testimonial Carousel",
        "User Profile Page",
        "Rating System UI",
        "Tooltips and Popovers",
        "Loading Spinner Animation",
        "Responsive Table Design",
        "Interactive Calendar UI",
        "Search Results Page",
        "Filterable Product Gallery",
        "Sticky Footer",
        "Interactive Timeline UI",
        "Product Feature Comparison Table",
        "Blog Post Layout",
        "Testimonials Section",
        "Hover Card Animations",
        "Collapsible Sections",
        "Progress Indicator",
        "Interactive Infographic UI",
        "Product Quick View",
        "Custom Dropdown with Search",
        "Advanced Product Carousel",
        "Contact Form with Map Integration",
        "Editable Table UI",
        "Social Media Feed",
        "Custom Scrollbars",
        "Multi-Column Layout for Blog or News",
        "Interactive Data Visualization",
        "Custom Video Player UI",
        "Interactive Dashboard UI",
        "Live Chat UI",
        "E-commerce Product Page",
        "Animated Page Transitions",
        "Audio Player UI",
        "Dynamic Form with Conditional Fields",
        "Parallax Scrolling Effects",
        "Drag and Drop Interface",
        "Interactive World Map UI",
        "Shopping Cart UI",
        "Advanced Filtering System",
        "Custom Animation on Scroll",
        "Advanced Search with Autocomplete",
        "User Dashboard with Analytics",
        "Advanced Notification System",
        "Responsive Image Slider with Thumbnails",
        "Onboarding Walkthrough UI",
        "Custom Form Validation and Error Handling",
        "Contextual Help UI",
        "Advanced Date Picker UI",
        "Sticky Sidebar with Scrollspy",
        "Live User Notifications UI",
        "Responsive Mega Menu",
        "Interactive Pricing Slider",
        "Customizable Dashboard Widgets",
        "Advanced Product Filtering and Sorting UI",
        "Multi-Layered Parallax Page",
        "Interactive Storytelling Page",
        "Kanban Board UI",
        "Product Customization UI",
        "Task Management App UI",
        "Interactive Analytics Dashboard",
        "Advanced eCommerce Checkout UI",
        "Interactive Quiz UI",
        "Progressive Web App UI",
        "Custom Map Integration",
        "Advanced Multi-Step Form with Validation",
        "Interactive Chatbot UI"
    ];

const challengeContainer = document.querySelector('.challenge-container');

function renderNodes() {
    console.log("renderNodes called");
    const nodeContainer = document.querySelector('.challenge-container');
    if (!nodeContainer) {
        console.error("Challenge container not found");
        return;
    }
    nodeContainer.innerHTML = ''; // Clear the container
    
    function createNodeElement(day, content) {
        const nodeContainer = document.createElement('div');
        nodeContainer.classList.add('node-container');

        const node = document.createElement('div');
        node.classList.add('node');
        if (day === currentDay) {
            node.classList.add('current');
        }
        
        node.innerHTML = `
            <h2>Day ${day.toString().padStart(3, '0')}</h2>
            <p>${content.task}</p>
        `;

        if (day === currentDay || (day < currentDay && content.image)) {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('node-image-container');
            
            if (day === currentDay) {
                imageContainer.innerHTML = `
                    <label for="file-input-${day}">
                        <img src="upload-icon.png" alt="Upload" style="width: 64px; height: 64px; cursor: pointer;"/>
                    </label>
                    <input id="file-input-${day}" type="file" accept="image/*" onchange="handleImageUpload(event, ${day})" style="display: none;"/>
                `;
            } else if (content.image) {
                imageContainer.innerHTML = `<img src="${content.image}" alt="Day ${day} task">`;
            }
            
            node.appendChild(imageContainer);
        }

        if (day === currentDay) {
            const button = document.createElement('button');
            button.classList.add('complete-task-button');
            button.innerHTML = '✓';
            button.onclick = completeTask;
            button.disabled = !content.image;
            node.appendChild(button);
        }

        const line = document.createElement('div');
        line.classList.add('connecting-line');

        nodeContainer.appendChild(node);
        nodeContainer.appendChild(line);

        return nodeContainer;
    }
    
    if (currentDay <= tasks.length) {
        const currentNodeContent = {
            task: tasks[currentDay - 1],
            image: localStorage.getItem(`day${currentDay}Image`)
        };
        nodeContainer.appendChild(createNodeElement(currentDay, currentNodeContent));
    }
    
    for (let i = currentDay - 1; i > 0; i--) {
        const completedNodeContent = {
            task: tasks[i - 1],
            image: localStorage.getItem(`day${i}Image`)
        };
        nodeContainer.appendChild(createNodeElement(i, completedNodeContent));
    }
    
    const lastNode = nodeContainer.lastElementChild;
    if (lastNode) {
        const lastLine = lastNode.querySelector('.connecting-line');
        if (lastLine) lastLine.remove();
    }

    updateZoomButtonStates();
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const nodes = document.querySelectorAll('.node-container');
    nodes.forEach(node => {
        const uploadArea = node.querySelector('.node-image-container');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', handleDragOver);
            uploadArea.addEventListener('dragleave', handleDragLeave);
            uploadArea.addEventListener('drop', handleDrop);
        }
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        const day = e.currentTarget.closest('.node-container').querySelector('h2').textContent.match(/\d+/)[0];
        handleImageUpload({ target: { files: [file] } }, day);
        document.querySelector('.complete-task-button').disabled = false;
    }
}

function handleImageUpload(event, day) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem(`day${day}Image`, e.target.result);
            document.querySelector('.complete-task-button').disabled = false;
            
            let img = document.querySelector('.node img');
            if (!img) {
                img = document.createElement('img');
                document.querySelector('.node').appendChild(img);
            }
            img.src = e.target.result;
            img.alt = `Day ${day} completed task`;
            
            console.log('Image uploaded for day', day);
        }
        reader.readAsDataURL(file);
    }
}

function completeTask() {
    console.log("Complete task called");
    const currentNodeImage = document.querySelector('.node-image-container img');
    if (!currentNodeImage) {
        alert("Please upload an image before marking the task as complete.");
        return;
    }
    if (currentDay < tasks.length) {
        localStorage.setItem(`day${currentDay}Image`, currentNodeImage.src);
        currentDay++;
        localStorage.setItem('currentDay', currentDay);
        renderNodes();
    } else {
        console.log("Challenge completed!");
    }
}

function restartChallenge() {
    console.log("Restart challenge called");
    currentDay = 1;
    localStorage.clear();
    renderNodes();
}

function updateProgressBar() {
    const progress = (currentDay - 1) / tasks.length * 100;
    const progressBar = document.querySelector('.progress-bar') || document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
    document.body.insertBefore(progressBar, document.body.firstChild);
}

//test

function shareProgress() {
    const text = `I'm on Day ${currentDay} of my 100-day design challenge! 🎨✨`;
    if (navigator.share) {
        navigator.share({text: text})
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.log('Error sharing', error));
    } else {
        prompt('Copy this text to share:', text);
    }
}

let isZoomedOut = false;

const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');

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
    const nodes = Array.from(challengeContainer.querySelectorAll('.node-container'));
    nodes.sort((a, b) => {
        const dayA = parseInt(a.querySelector('h2').textContent.match(/\d+/)[0]);
        const dayB = parseInt(b.querySelector('h2').textContent.match(/\d+/)[0]);
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

document.addEventListener('DOMContentLoaded', setupEventListeners);

// Initial setup
console.log('Initial setup');
arrangeNodesVertically();
challengeContainer.classList.add('zoomed-in');

function toggleZoom() {
    const container = document.querySelector('.challenge-container');
    isZoomedOut = !isZoomedOut;
    if (isZoomedOut) {
        container.classList.add('zoomed-out');
    } else {
        container.classList.remove('zoomed-out');
    }
}

function updateZoomButtonStates() {
    zoomInBtn.disabled = !isZoomedOut;
    zoomOutBtn.disabled = isZoomedOut;
}

window.onload = function() {
    console.log("Window loaded");
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
};

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}