import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { uploadImage } from './upload.js';

let challengeContainer = null;
let currentDay = 1;

document.addEventListener('DOMContentLoaded', function() {
    challengeContainer = document.querySelector('.challenge-container');
});

onAuthStateChanged(auth, async function(user) {
    if (user) {
        console.log("User is signed in:", user.uid);
        challengeContainer = document.querySelector('.challenge-container');
        if (challengeContainer) {
            console.log('Challenge container found');
            await loadChallenges();
            console.log('Challenges loaded, current day:', currentDay);
            renderNodes();
        } else {
            console.error('Challenge container not found');
        }
    } else {
        console.log("No user signed in");
        window.location.href = 'login.html';
    }
});

async function initializeDefaultNodes(userId) {
    const challengesRef = collection(db, 'users', userId, 'challenges');
    const designChallenges = [
        "Simple Button design",
        "Login Form",
        "Registration Form",
        "Navigation Bar",
        "Simple Footer",
        "Card Layout",
        "Profile Card",
        "Product Grid Layout",
        "Search Bar UI",
        "Responsive Image Gallery",
        "Dropdown Menu",
        "Responsive Sidebar Menu",
        "Accordion UI",
        "Interactive Tabs",
        "Responsive Hero Section",
        "Light/Dark Mode Toggle",
        "Sticky Navigation Bar",
        "Sliding Testimonial Carousel",
        "Rating System UI",
        "Progress Indicator",
        "Blog Post Layout",
        "Testimonials Section",
        "Hover Card Animations",
        "Interactive Calendar UI",
        "Product Quick View",
        "Advanced Product Carousel",
        "Social Media Feed",
        "Interactive Data Visualization",
        "Custom Video Player UI",
        "Interactive Dashboard UI"
    ];

    for (let i = 0; i < designChallenges.length; i++) {
        await addDoc(challengesRef, {
            day: i + 1,
            description: designChallenges[i],
            completed: false
        });
    }
}

async function loadChallenges() {
    const user = auth.currentUser;
    if (user) {
        const challengesRef = collection(db, 'users', user.uid, 'challenges');
        const q = query(challengesRef, orderBy('day'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            await initializeDefaultNodes(user.uid);
            currentDay = 1;
        } else {
            const completedChallenges = querySnapshot.docs.filter(doc => doc.data().completed);
            currentDay = completedChallenges.length + 1;
        }
    }
    console.log('Current day:', currentDay);
}

async function renderNodes() {
    if (!challengeContainer) {
        console.error('Challenge container not found');
        return;
    }
    challengeContainer.innerHTML = '';
    console.log('Rendering nodes...');
    const user = auth.currentUser;
    if (user) {
        const challengesRef = collection(db, 'users', user.uid, 'challenges');
        const q = query(challengesRef, orderBy('day'));
        const querySnapshot = await getDocs(q);
        
        console.log('Number of challenges:', querySnapshot.size);
        
        querySnapshot.forEach((doc) => {
            const challengeData = doc.data();
            console.log('Challenge data:', challengeData);
            if (challengeData.day <= currentDay) {
                const node = createNode(challengeData);
                challengeContainer.appendChild(node);
                console.log('Node appended for day:', challengeData.day);
            }
        });
    } else {
        console.error('User not authenticated');
    }
}

function createNode(challengeData) {
    const node = document.createElement('div');
    node.classList.add('node');
    if (challengeData.completed) {
        node.classList.add('completed');
    }
    node.innerHTML = `
        <h2>Day ${challengeData.day}</h2>
        <p>${challengeData.description}</p>
        <div class="node-image-container" id="image-container-${challengeData.day}">
            <input type="file" id="file-input-${challengeData.day}" style="display: none;" accept="image/*">
            <label for="file-input-${challengeData.day}" class="upload-label">Upload Image</label>
        </div>
    `;
    
    const imageContainer = node.querySelector(`#image-container-${challengeData.day}`);
    const fileInput = node.querySelector(`#file-input-${challengeData.day}`);

    // Add drag and drop event listeners
    imageContainer.addEventListener('dragover', handleDragOver);
    imageContainer.addEventListener('dragleave', handleDragLeave);
    imageContainer.addEventListener('drop', (event) => handleDrop(event, challengeData.day));

    // Add file input change event listener
    fileInput.addEventListener('change', (event) => handleFileSelect(event, challengeData.day));
    
    return node;
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event, day) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('drag-over');

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file, day);
    }
}

function handleFileSelect(event, day) {
    const file = event.target.files[0];
    if (file) {
        handleImageUpload(file, day);
    }
}

async function handleImageUpload(file, day) {
    try {
        const imageUrl = await uploadImage(file);
        const imgContainer = document.getElementById(`image-container-${day}`);
        imgContainer.innerHTML = `<img src="${imageUrl}" alt="Uploaded design">`;
        // Here you would typically update the challenge data in your database
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
    }
}
