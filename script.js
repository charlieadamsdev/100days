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
            node.innerHTML = content;
    
            const line = document.createElement('div');
            line.classList.add('connecting-line');
    
            nodeContainer.appendChild(node);
            nodeContainer.appendChild(line);
    
            return nodeContainer;
        }
    
        // Render the current task
        if (currentDay <= tasks.length) {
            const currentNodeContent = `
                <h2>Day ${currentDay.toString().padStart(3, '0')}</h2>
                <p>${tasks[currentDay - 1]}</p>
                <div class="image-upload">
                    <label for="file-input">
                        <img src="upload-icon.png" alt="Upload"/>
                    </label>
                    <input id="file-input" type="file" accept="image/*" onchange="handleImageUpload(event, ${currentDay})"/>
                </div>
                <button class="complete-task-button" onclick="completeTask()">Mark Complete</button>
            `;
            nodeContainer.appendChild(createNodeElement(currentDay, currentNodeContent));
        }
    
        // Render completed tasks
        for (let i = currentDay - 1; i > 0; i--) {
            const completedNodeContent = `
                <h2>Day ${i.toString().padStart(3, '0')}</h2>
                <p>${tasks[i - 1]}</p>
                <img src="${localStorage.getItem(`day${i}Image`) || 'placeholder.png'}" alt="Completed task"/>
            `;
            nodeContainer.appendChild(createNodeElement(i, completedNodeContent));
        }
    
        // Remove the last connecting line
        const lastNode = nodeContainer.lastElementChild;
        if (lastNode) {
            const lastLine = lastNode.querySelector('.connecting-line');
            if (lastLine) lastLine.remove();
        }
    }
    
    function handleImageUpload(event, day) {
        console.log("Image upload triggered for day:", day);
        // ... rest of the function remains the same
    }
    
    function completeTask() {
        console.log("Complete task called");
        if (currentDay < tasks.length) {
            currentDay++;
            localStorage.setItem('currentDay', currentDay);
            renderNodes();
        } else {
            console.log("Challenge completed!");
            // You can add some celebration or reset functionality here
        }
    }
    
    function restartChallenge() {
        console.log("Restart challenge called");
        currentDay = 1;
        localStorage.clear();
        renderNodes();
    }
    
    // Call renderNodes when the page loads
    window.onload = function() {
        console.log("Window loaded");
        currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
        renderNodes();
    };