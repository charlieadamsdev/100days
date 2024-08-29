import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, limit } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { uploadImage } from './upload.js';
import { storage } from './firebase-config.js';
import { doc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

const designChallenges = [
    "Simple Button design",
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
    "Interactive Dashboard UI",
    "E-commerce Product Page",
    "Animated Loading Spinner",
    "Responsive Pricing Table",
    "Interactive Chat Interface"
];

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
        "Interactive Dashboard UI",
        "E-commerce Product Page",
        "Animated Loading Spinner",
        "Responsive Pricing Table",
        "Interactive Chat Interface"
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
            const challenges = querySnapshot.docs.map(doc => doc.data());
            currentDay = challenges.find(challenge => !challenge.completed)?.day || challenges.length + 1;
        }
    }
    console.log('Current day:', currentDay);
}

async function renderNodes() {
    console.log('Starting renderNodes function');
    if (!challengeContainer) {
        console.error('Challenge container not found');
        return;
    }
    challengeContainer.innerHTML = '';
    console.log('Rendering nodes...');
    const user = auth.currentUser;
    console.log('Current user:', user);
    if (user) {
        const challengesRef = collection(db, 'users', user.uid, 'challenges');
        const q = query(challengesRef, orderBy('day', 'asc'));
        const querySnapshot = await getDocs(q);
        
        console.log('Query snapshot size:', querySnapshot.size);
        
        const nodes = [];
        querySnapshot.forEach((doc) => {
            const challengeData = doc.data();
            console.log('Challenge data:', challengeData);
            if (challengeData.completed || challengeData.day === currentDay) {
                const node = createNode(challengeData);
                nodes.push(node);
            }
        });

        console.log('Number of nodes created:', nodes.length);

        // Sort nodes in descending order (latest day on top)
        nodes.sort((a, b) => {
            const dayA = parseInt(a.querySelector('h2').textContent.split(' ')[1]);
            const dayB = parseInt(b.querySelector('h2').textContent.split(' ')[1]);
            return dayB - dayA;
        });

        // Append nodes
        nodes.forEach(node => {
            challengeContainer.appendChild(node);
        });

        console.log('Nodes rendered:', challengeContainer.children.length);
    } else {
        console.error('User not authenticated in renderNodes');
    }
}

function createNode(challengeData) {
    const nodeContainer = document.createElement('div');
    nodeContainer.classList.add('node-container');

    const node = document.createElement('div');
    node.classList.add('node');
    if (challengeData.completed) {
        node.classList.add('completed');
    } else if (challengeData.day === currentDay) {
        node.classList.add('current');
    }
    node.innerHTML = `
        <h2>Day ${challengeData.day}</h2>
        <p>${designChallenges[challengeData.day - 1] || challengeData.description}</p>
        <div class="node-image-container" id="image-container-${challengeData.day}">
            ${challengeData.imageUrl ? 
                `<img src="${challengeData.imageUrl}" alt="Day ${challengeData.day} design" style="width: 200px; height: 200px; object-fit: cover;">` :
                `<input type="file" id="file-input-${challengeData.day}" style="display: none;" accept="image/*">
                 <label for="file-input-${challengeData.day}" class="upload-label">
                     <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                         <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
                     </svg>
                 </label>`
            }
        </div>
        ${!challengeData.completed ? `
            <button class="confirm-button ${!challengeData.imageUrl ? 'disabled' : ''}" id="confirm-button-${challengeData.day}">
                <svg class="confirm-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
            </button>` : ''}
    `;

    nodeContainer.appendChild(node);

    if (challengeData.completed && challengeData.day > 1) {
        const connectingLine = document.createElement('div');
        connectingLine.classList.add('connecting-line');
        nodeContainer.appendChild(connectingLine);
    }

    if (!challengeData.completed && challengeData.day === currentDay) {
        const imageContainer = node.querySelector(`#image-container-${challengeData.day}`);
        const fileInput = node.querySelector(`#file-input-${challengeData.day}`);
        const confirmButton = node.querySelector(`#confirm-button-${challengeData.day}`);

        // Add drag and drop event listeners
        imageContainer.addEventListener('dragover', handleDragOver);
        imageContainer.addEventListener('dragleave', handleDragLeave);
        imageContainer.addEventListener('drop', (event) => handleDrop(event, challengeData.day));

        // Add file input change event listener
        fileInput.addEventListener('change', (event) => handleFileSelect(event, challengeData.day));

        // Add confirm button click event listener
        confirmButton.addEventListener('click', () => handleConfirm(challengeData.day));
    }
    
    return nodeContainer;
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
        console.log('Uploading file:', file.name, 'Size:', file.size);
        if (!storage) {
            throw new Error('Firebase Storage is not initialized');
        }
        const imageUrl = await uploadImage(file);
        console.log('Upload successful, URL:', imageUrl);
        const imgContainer = document.getElementById(`image-container-${day}`);
        imgContainer.innerHTML = `<img src="${imageUrl}" alt="Uploaded design" style="width: 200px; height: 200px; object-fit: cover;">`;
        
        // Show the confirm button
        const confirmButton = document.getElementById(`confirm-button-${day}`);
        confirmButton.classList.remove('disabled');
    } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload image: ${error.message}`);
    }
}

async function handleConfirm(day) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const challengesRef = collection(db, 'users', user.uid, 'challenges');
        const q = query(challengesRef, where('day', '==', day));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('Challenge not found');
        }

        const challengeDoc = querySnapshot.docs[0];
        const imageContainer = document.getElementById(`image-container-${day}`);
        const imageElement = imageContainer.querySelector('img');

        if (!imageElement) {
            throw new Error('Please upload your design to progress to the next day');
        }

        const imageUrl = imageElement.src;

        console.log(`Confirming challenge for day ${day} with image URL: ${imageUrl}`);

        await updateDoc(challengeDoc.ref, {
            completed: true,
            imageUrl: imageUrl
        });

        console.log(`Challenge day ${day} marked as completed and image URL saved`);

        // Find the next uncompleted day
        const allChallengesQuery = query(challengesRef, orderBy('day', 'asc'));
        const allChallengesSnapshot = await getDocs(allChallengesQuery);
        currentDay = allChallengesSnapshot.docs.find(doc => !doc.data().completed)?.data().day || day + 1;

        console.log(`Next uncompleted day: ${currentDay}`);

        // Render nodes to show the updated state
        await renderNodes();

    } catch (error) {
        console.error('Error confirming challenge:', error);
        alert(`${error.message}`);
    }
}

function createPlaceholderNode(day) {
    const node = document.createElement('div');
    node.classList.add('node', 'placeholder');
    node.innerHTML = `
        <h2>Day ${day}</h2>
        <p>Complete the current day to unlock</p>
    `;
    return node;
}
