import { db, storage } from './firebase.js';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateStats } from './dashboard.js';

const foodNameInput = document.getElementById("foodName");
const foodPriceInput = document.getElementById("foodPrice");
const foodPhotoInput = document.getElementById("foodPhoto");
const foodMenuList = document.getElementById("foodMenuList");

// Add Food Item
window.addFood = async function() {
    const name = foodNameInput.value.trim();
    const price = parseFloat(foodPriceInput.value);
    const file = foodPhotoInput.files[0];

    if (!name || !price || !file) {
        alert("Please fill all fields and select a photo.");
        return;
    }

    try {
        const photoRef = ref(storage, `food/${file.name}_${Date.now()}`);
        await uploadBytes(photoRef, file);
        const photoURL = await getDownloadURL(photoRef);

        await addDoc(collection(db, "foods"), {
            name,
            price,
            photoURL
        });

        foodNameInput.value = "";
        foodPriceInput.value = "";
        foodPhotoInput.value = "";

        loadFoods();
        updateStats();

    } catch (err) {
        console.error(err);
        alert("Error adding food: " + err.message);
    }
};

// Load Food Items
export async function loadFoods() {
    foodMenuList.innerHTML = "";
    const foodsSnapshot = await getDocs(collection(db, "foods"));

    foodsSnapshot.forEach(docSnap => {
        const food = docSnap.data();
        const foodId = docSnap.id;

        const card = document.createElement("div");
        card.className = "cardItem";

        card.innerHTML = `
            <img src="${food.photoURL}" alt="${food.name}">
            <h4>${food.name}</h4>
            <p>Price: $${food.price}</p>
            <button onclick="orderFood('${foodId}', '${food.name}', ${food.price})">
                Order
            </button>
        `;

        foodMenuList.appendChild(card);
    });
}

// Order Food
window.orderFood = async function(foodId, foodName, price) {
    const guestName = prompt("Enter Guest Service Name for billing:");
    if (!guestName) return;

    try {
        await addDoc(collection(db, "billing"), {
            guest: guestName,
            item: foodName,
            type: "food",
            price: price,
            status: "unpaid",
            paymentMethod: null,
            date: new Date().toISOString().split('T')[0]
        });

        alert(`Food "${foodName}" ordered! Billing added for ${guestName}.`);
        updateStats();
    } catch (err) {
        console.error(err);
        alert("Error ordering food: " + err.message);
    }
};

document.addEventListener("DOMContentLoaded", loadFoods);
