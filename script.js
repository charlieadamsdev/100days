import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
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
    "Responsive Footer Design",
    "404 Error Page Design"
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
        "E-commerce Product Page"
    ];

    for (let i = 0; i < 30; i++) {
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
    if (!challengeContainer) {
        console.error('Challenge container not found');
        return;
    }
    challengeContainer.innerHTML = '';
    console.log('Rendering nodes...');
    const user = auth.currentUser;
    if (user) {
        const challengesRef = collection(db, 'users', user.uid, 'challenges');
        const q = query(challengesRef, orderBy('day', 'asc'));  // Order by day in ascending order
        const querySnapshot = await getDocs(q);
        
        console.log('Number of challenges:', querySnapshot.size);
        
        const nodes = [];
        querySnapshot.forEach((doc) => {
            const challengeData = doc.data();
            console.log('Challenge data:', challengeData);
            const node = renderNode(challengeData);
            nodes.push(node);
        });

        // Append nodes in reverse order
        nodes.forEach(node => {
            challengeContainer.insertBefore(node, challengeContainer.firstChild);
        });

        console.log('Nodes rendered:', challengeContainer.children.length);
    } else {
        console.error('User not authenticated');
    }
}

function renderNode(challengeData) {
    const node = document.createElement('div');
    node.className = `node ${challengeData.day === currentDay ? 'current' : ''}`;
    node.innerHTML = `
        <h2>Day ${challengeData.day.toString().padStart(3, '0')}</h2>
        <p>${designChallenges[challengeData.day - 1] || challengeData.description}</p>
        <div class="node-image-container" id="image-container-${challengeData.day}">
            ${challengeData.completed && challengeData.imageUrl ? 
                `<img src="${challengeData.imageUrl}" alt="Day ${challengeData.day} design">` :
                `<input type="file" id="file-input-${challengeData.day}" style="display: none;" accept="image/*">
                 <label for="file-input-${challengeData.day}" class="upload-label">Upload Image</label>`
            }
        </div>
        ${!challengeData.completed ? `<button class="confirm-button" id="confirm-button-${challengeData.day}" style="display: none;">Confirm</button>` : ''}
    `;
    
    if (!challengeData.completed) {
        const imageContainer = node.querySelector(`#image-container-${challengeData.day}`);
        const fileInput = node.querySelector(`#file-input-${challengeData.day}`);
        const confirmButton = node.querySelector(`#confirm-button-${challengeData.day}`);

        imageContainer.addEventListener('dragover', handleDragOver);
        imageContainer.addEventListener('dragleave', handleDragLeave);
        imageContainer.addEventListener('drop', (event) => handleDrop(event, challengeData.day));

        fileInput.addEventListener('change', (event) => handleFileSelect(event, challengeData.day));

        confirmButton.addEventListener('click', () => handleConfirm(challengeData.day));
    }

    const nodeContainer = document.createElement('div');
    nodeContainer.className = 'node-container';
    nodeContainer.appendChild(node);

    if (challengeData.day < 30) {
        const connectingLine = document.createElement('div');
        connectingLine.className = 'connecting-line';
        nodeContainer.appendChild(connectingLine);
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
        imgContainer.innerHTML = `<img src="${imageUrl}" alt="Uploaded design">`;
        
        // Show the confirm button
        const confirmButton = document.getElementById(`confirm-button-${day}`);
        confirmButton.style.display = 'block';
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
        const imageUrl = imageContainer.querySelector('img').src;

        await updateDoc(challengeDoc.ref, {
            completed: true,
            imageUrl: imageUrl
        });

        console.log(`Challenge day ${day} marked as completed`);

        // Create next day's challenge
        const nextDay = day + 1;
        
        if (nextDay <= 30) {
            await addDoc(challengesRef, {
                day: nextDay,
                description: designChallenges[nextDay - 1],
                completed: false
            });
            console.log(`Created challenge for day ${nextDay}`);
        } else {
            console.log('All challenges completed');
        }

        // Reload challenges and render nodes
        await loadChallenges();
        await renderNodes();

    } catch (error) {
        console.error('Error confirming challenge:', error);
        alert(`Failed to confirm challenge: ${error.message}`);
    }
}
