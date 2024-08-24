// Initialize variables
let currentDay = 1;
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
        const nodeContainer = document.querySelector('.node-container');
        
        if (!nodeContainer) {
            console.error("Node container is missing.");
            return;
        }
        
        nodeContainer.innerHTML = ''; // Clear the container
        const currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
    
        // We only want to show the nodes up to the currentDay
        for (let i = 0; i < currentDay; i++) {
            const node = document.createElement('div');
            node.classList.add('node');
    
            if (i + 1 < currentDay) {
                node.classList.add('completed'); // Mark completed tasks
            } else if (i + 1 === currentDay) {
                node.classList.add('current'); // Highlight the current task
            }
    
            node.innerHTML = `<p>Day ${i + 1}: ${tasks[i]}</p>`;
            nodeContainer.appendChild(node);
        }
    
        // Adjust button visibility based on the progress
        const completeTaskButton = document.getElementById('complete-task');
        const restartButton = document.getElementById('restart-button');
    
        if (currentDay > tasks.length) {
            completeTaskButton.style.display = 'none';
            restartButton.style.display = 'block';
        } else {
            completeTaskButton.style.display = 'block';
            restartButton.style.display = 'none';
        }
    }
    
    function completeTask() {
        let currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
    
        // Increment the day count
        currentDay++;
        localStorage.setItem('currentDay', currentDay);
    
        // Re-render the nodes to show the next task while keeping previous tasks stacked
        renderNodes();
    }
    
    function restartChallenge() {
        if (confirm("Are you sure you want to restart the challenge?")) {
            localStorage.setItem('currentDay', 1);
            
            // Re-render the nodes and reset everything
            renderNodes();
        }
    }
    
    window.onload = renderNodes;