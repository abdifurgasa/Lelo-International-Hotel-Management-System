// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// Firebase Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firestore Database
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Storage (for images)
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCO4SKZUedlEG5tROqwMgJ_sDE6rKSEsyo",
  authDomain: "lelo-international-hotel-hotel.firebaseapp.com",
  projectId: "lelo-international-hotel-hotel",
  storageBucket: "lelo-international-hotel-hotel.firebasestorage.app",
  messagingSenderId: "964251932564",
  appId: "1:964251932564:web:0ead1b02ebcb4e3f17a181",
  measurementId: "G-BY39RYMTEE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
