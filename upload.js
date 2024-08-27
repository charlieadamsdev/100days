import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

async function uploadImage(file) {
    const storageRef = ref(storage, 'images/' + file.name);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File available at', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Upload failed', error);
        throw error;
    }
}

export { uploadImage };