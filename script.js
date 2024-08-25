// Initialize variables
let currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
const totalDays = 100;
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
        "Step-by-Step Form UI",
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

function renderNodes() {
    const nodeContainer = document.querySelector('.challenge-container');
    nodeContainer.innerHTML = ''; // Clear the container

    // Render the current task
    if (currentDay <= tasks.length) {
        const currentNode = document.createElement('div');
        currentNode.classList.add('node', 'current');
        currentNode.innerHTML = `<p>Day ${currentDay}: ${tasks[currentDay - 1]}</p>
                                 <button class="complete-task-button" onclick="completeTask()">Mark Task Complete</button>`;
        nodeContainer.appendChild(currentNode);
    }

    // Render completed tasks below the current task
    for (let i = currentDay - 1; i > 0; i--) {
        const completedNode = document.createElement('div');
        completedNode.classList.add('node', 'completed');
        completedNode.innerHTML = `<p>Day ${i}: ${tasks[i - 1]}</p>`;
        nodeContainer.appendChild(completedNode);
    }

    // Scroll the current task to the center of the screen
    scrollToCurrentNode();
}

function completeTask() {
    currentDay++; // Increment the task counter
    if (currentDay > tasks.length) {
        currentDay = tasks.length; // Prevent exceeding the total number of tasks
    }
    localStorage.setItem('currentDay', currentDay); // Save the current day in local storage
    renderNodes(); // Re-render the nodes
}

function restartChallenge() {
    if (confirm("Are you sure you want to restart the challenge?")) {
        currentDay = 1; // Reset to the first day
        localStorage.setItem('currentDay', currentDay); // Save the reset in local storage
        renderNodes(); // Re-render the nodes
    }
}

// Helper function to scroll the current task into the center of the viewport
function scrollToCurrentNode() {
    const currentNode = document.querySelector('.node.current');
    if (currentNode) {
        currentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Render the initial nodes on page load
renderNodes();