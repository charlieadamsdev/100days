import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyCPhfcH8_rHpiRpKjHx97_zjLyh_zR1AKg",
  authDomain: "days-ce84e.firebaseapp.com",
  projectId: "days-ce84e",
  storageBucket: "days-ce84e.appspot.com",
  messagingSenderId: "945856714576",
  appId: "1:945856714576:web:47788bd341546facd6fe55",
  measurementId: "G-KN7ZPPGSCN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("Firebase app initialized:", app);
console.log("Firebase auth initialized:", auth);

export { app, auth, db, storage, firebaseConfig };