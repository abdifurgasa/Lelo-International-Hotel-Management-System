// restaurant.js
import { db } from "./firebase.js";
import { collection, addDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { addBill } from "./billingHelper.js"; // helper to add bills

const foodMenuListEl = document.getElementById("foodMenuList");

// Add Food
export async function addFood() {
    const name = document.getElementById("foodName").value;
    const price = parseFloat(document.getElementById("foodPrice").value);
    const photo = document.getElementById("foodPhoto").files[0];

    if (!name || !price || !photo) return alert("Fill all fields");

    const photoURL = URL.createObjectURL(photo);

    await addDoc(collection(db, "foods"), {
        name,
        price,
        photoURL
    });

    loadFoodMenu();
}

// Load Food Menu
export async function loadFoodMenu() {
    foodMenuListEl.innerHTML = "";
    const snapshot = await getDocs(collection(db, "foods"));
    snapshot.forEach(docSnap => {
        const food = docSnap.data();
        const card = document.createElement("div");
        card.className = "cardItem";
        card.innerHTML = `
            <img src="${food.photoURL}" alt="${food.name}">
            <h4>${food.name}</h4>
            <p>Price: $${food.price}</p>
        `;
        // Click to order
        card.addEventListener("click", async () => {
            await addBill("guest_service", food.name, "food", food.price);
            alert(`${food.name} ordered. Bill added to Guest Service.`);
        });
        foodMenuListEl.appendChild(card);
    });
}
