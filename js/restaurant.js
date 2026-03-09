import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
LOAD FOOD ITEMS
=============================== */
window.loadFoods = async function() {
    const list = document.getElementById("foodMenuList");
    if (!list) return;
    list.innerHTML = "";

    try {
        const foodSnap = await getDocs(collection(db, "foods"));
        foodSnap.forEach(doc => {
            const food = doc.data();
            const div = document.createElement("div");
            div.className = "roomCard"; // reuse style
            div.innerHTML = `
                <img src="${food.photo || 'img/default-food.jpg'}" alt="Food">
                <h4>${food.name}</h4>
                <p>Price: $${food.price}</p>
            `;

            div.onclick = () => orderItem(doc.id, food, "food");
            list.appendChild(div);
        });
    } catch (err) {
        console.log("Load foods error:", err);
    }
};

/* ===============================
ADD FOOD ITEM
=============================== */
window.addFood = async function() {
    const name = document.getElementById("foodName").value.trim();
    const price = document.getElementById("foodPrice").value;
    const photoInput = document.getElementById("foodPhoto");

    if (!name || !price) {
        alert("Please fill all fields");
        return;
    }

    let photoUrl = "";
    if (photoInput && photoInput.files.length > 0) {
        const file = photoInput.files[0];
        photoUrl = await toBase64(file);
    }

    try {
        await addDoc(collection(db, "foods"), {
            name,
            price: Number(price),
            photo: photoUrl
        });

        alert("Food added!");
        document.getElementById("foodName").value = "";
        document.getElementById("foodPrice").value = "";
        photoInput.value = "";

        loadFoods();
    } catch (err) {
        console.log(err);
        alert("Failed to add food");
    }
};

/* ===============================
ORDER FOOD
=============================== */
async function orderItem(itemId, itemData, type) {
    const guest = prompt("Guest Name / Email?");
    if (!guest) return;

    try {
        await addDoc(collection(db, "billing"), {
            itemId,
            itemType: type,
            name: itemData.name,
            price: itemData.price,
            guest,
            status: "Pending"
        });
        alert(`${type} ordered! Billing added.`);
    } catch (err) {
        console.log(err);
        alert("Order failed");
    }
}

/* ===============================
HELPER: convert photo to Base64
=============================== */
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/* ===============================
AUTO LOAD FOOD LIST
=============================== */
loadFoods();
