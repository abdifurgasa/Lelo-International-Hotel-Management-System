import { db, storage } from './firebase.js';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateStats } from './dashboard.js';

const drinkNameInput = document.getElementById("drinkName");
const drinkPriceInput = document.getElementById("drinkPrice");
const drinkPhotoInput = document.getElementById("drinkPhoto");
const drinkMenuList = document.getElementById("drinkMenuList");

// Add Drink Item
window.addDrink = async function() {
    const name = drinkNameInput.value.trim();
    const price = parseFloat(drinkPriceInput.value);
    const file = drinkPhotoInput.files[0];

    if (!name || !price || !file) {
        alert("Please fill all fields and select a photo.");
        return;
    }

    try {
        const photoRef = ref(storage, `drinks/${file.name}_${Date.now()}`);
        await uploadBytes(photoRef, file);
        const photoURL = await getDownloadURL(photoRef);

        await addDoc(collection(db, "drinks"), {
            name,
            price,
            photoURL
        });

        drinkNameInput.value = "";
        drinkPriceInput.value = "";
        drinkPhotoInput.value = "";

        loadDrinks();
        updateStats();

    } catch (err) {
        console.error(err);
        alert("Error adding drink: " + err.message);
    }
};

// Load Drink Items
export async function loadDrinks() {
    drinkMenuList.innerHTML = "";
    const drinksSnapshot = await getDocs(collection(db, "drinks"));

    drinksSnapshot.forEach(docSnap => {
        const drink = docSnap.data();
        const drinkId = docSnap.id;

        const card = document.createElement("div");
        card.className = "cardItem";

        card.innerHTML = `
            <img src="${drink.photoURL}" alt="${drink.name}">
            <h4>${drink.name}</h4>
            <p>Price: $${drink.price}</p>
            <button onclick="orderDrink('${drinkId}', '${drink.name}', ${drink.price})">
                Order
            </button>
        `;

        drinkMenuList.appendChild(card);
    });
}

// Order Drink
window.orderDrink = async function(drinkId, drinkName, price) {
    const guestName = prompt("Enter Guest Service Name for billing:");
    if (!guestName) return;

    try {
        await addDoc(collection(db, "billing"), {
            guest: guestName,
            item: drinkName,
            type: "drink",
            price: price,
            status: "unpaid",
            paymentMethod: null,
            date: new Date().toISOString().split('T')[0]
        });

        alert(`Drink "${drinkName}" ordered! Billing added for ${guestName}.`);
        updateStats();
    } catch (err) {
        console.error(err);
        alert("Error ordering drink: " + err.message);
    }
};

document.addEventListener("DOMContentLoaded", loadDrinks);
