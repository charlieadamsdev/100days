// Initialize variables
let currentDay = 1;
const totalDays = 100;
const tasks = {
    design: [
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
    ]
};

function startChallenge() {
    const category = document.getElementById('category').value;
    if (category) {
        localStorage.setItem('category', category);
        localStorage.setItem('currentDay', 1); // Start from day 1
        window.location.href = "tracker.html"; // Redirect to tracker page
    } else {
        alert("Please select a category");
    }
}

function loadChallenge() {
    const category = localStorage.getItem('category');
    const currentDay = parseInt(localStorage.getItem('currentDay'));
    const streak = parseInt(localStorage.getItem('streak')) || 0;

    if (currentDay <= tasks[category].length) {
        document.getElementById('challenge-day').textContent = `Day ${currentDay}`;
        document.getElementById('task').textContent = tasks[category][currentDay - 1];
        document.getElementById('streak').textContent = streak;
        document.getElementById('restart-button').style.display = "none";  // Hide the button if tasks are not completed
    } else {
        // Show Challenge Completed message and Restart button
        document.getElementById('challenge-day').textContent = "Challenge Completed!";
        document.getElementById('task').textContent = "";
        document.querySelector('button[onclick="completeTask()"]').style.display = "none";

        // Show the Restart button
        document.getElementById('restart-button').style.display = "block";  // Make the button visible
    }
}

function completeTask() {
    let currentDay = parseInt(localStorage.getItem('currentDay'));
    let streak = parseInt(localStorage.getItem('streak')) || 0;

    // Increment streak if a task is completed
    streak++;
    localStorage.setItem('streak', streak);
    document.getElementById('streak').textContent = streak;

    currentDay++;
    localStorage.setItem('currentDay', currentDay);
    loadChallenge();
}

// Restart the challenge - temporary feature
function restartChallenge() {
    if (confirm("Are you sure you want to restart the challenge?")) {
        localStorage.setItem('currentDay', 1);
        localStorage.setItem('streak', 0);

        // Make sure the "Mark Task Complete" button is shown again
        document.querySelector('button[onclick="completeTask()"]').style.display = "block";

        loadChallenge();  // Reload the first task
    }
}
