// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// Import Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Import Firestore Database
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCO4SKZUedlEG5tROqwMgJ_sDE6rKSEsyo",
  authDomain: "lelo-international-hotel-hotel.firebaseapp.com",
  projectId: "lelo-international-hotel-hotel",
  storageBucket: "lelo-international-hotel-hotel.firebasestorage.app",
  messagingSenderId: "964251932564",
  appId: "1:964251932564:web:0ead1b02ebcb4e3f17a181"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
