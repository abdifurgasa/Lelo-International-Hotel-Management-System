import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {

apiKey: "AIzaSyCO4SKZUedlEG5tROqwMgJ_sDE6rKSEsyo",
authDomain: "lelo-international-hotel-hotel.firebaseapp.com",
projectId: "lelo-international-hotel-hotel",
storageBucket: "lelo-international-hotel-hotel.firebasestorage.app",
messagingSenderId: "964251932564",
appId: "1:964251932564:web:0ead1b02ebcb4e3f17a181"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
