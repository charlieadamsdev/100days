import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';

async function uploadImage(file) {
    console.log('Storage object:', storage);
    if (!storage) {
        throw new Error('Firebase Storage is not initialized');
    }
    const storageRef = ref(storage, 'images/' + file.name);
    try {
        console.log('Starting upload to Firebase Storage');
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Upload successful, getting download URL');
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File available at', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Upload failed', error);
        throw error;
    }
}

export { uploadImage };