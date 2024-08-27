import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { uploadImage } from './upload.js';
import { storage } from './firebase-config.js';
import { doc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

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
        // ... other challenges ...
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
        
        const nodes = [];
        let lastCompletedDay = 0;
        
        querySnapshot.forEach((doc) => {
            const challengeData = doc.data();
            console.log('Challenge data:', challengeData);
            if (challengeData.completed) {
                lastCompletedDay = challengeData.day;
            }
            if (challengeData.completed || challengeData.day === lastCompletedDay + 1) {
                const node = createNode(challengeData);
                nodes.push(node);
                console.log('Node created for day:', challengeData.day);
            }
        });
        
        nodes.forEach(node => {
            challengeContainer.appendChild(node);
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
    if (!challengeData.completed) {
        node.classList.add('current');
    }
    node.innerHTML = `
        <h2>Day ${challengeData.day}</h2>
        <p>${challengeData.description}</p>
        <div class="node-image-container" id="image-container-${challengeData.day}">
            <input type="file" id="file-input-${challengeData.day}" style="display: none;" accept="image/*">
            <label for="file-input-${challengeData.day}" class="upload-label">Upload Image</label>
        </div>
        <button class="confirm-button" id="confirm-button-${challengeData.day}" style="display: none;">Confirm</button>
    `;
    
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
        await updateDoc(challengeDoc.ref, {
            completed: true
        });

        // Update UI to show the challenge is completed
        const node = document.querySelector(`.node:nth-child(${day})`);
        node.classList.add('completed');

        // Hide the confirm button
        const confirmButton = document.getElementById(`confirm-button-${day}`);
        confirmButton.style.display = 'none';

        // Unlock the next node
        currentDay = day + 1;
        await renderNodes();

    } catch (error) {
        console.error('Error confirming challenge:', error);
        alert(`Failed to confirm challenge: ${error.message}`);
    }
}
