import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
LOAD DRINKS
=============================== */
window.loadDrinks = async function() {
    const list = document.getElementById("drinkMenuList");
    if (!list) return;
    list.innerHTML = "";

    try {
        const drinkSnap = await getDocs(collection(db, "drinks"));
        drinkSnap.forEach(doc => {
            const drink = doc.data();
            const div = document.createElement("div");
            div.className = "roomCard"; // reuse style
            div.innerHTML = `
                <img src="${drink.photo || 'img/default-drink.jpg'}" alt="Drink">
                <h4>${drink.name}</h4>
                <p>Price: $${drink.price}</p>
            `;

            div.onclick = () => orderItem(doc.id, drink, "drink");
            list.appendChild(div);
        });
    } catch (err) {
        console.log("Load drinks error:", err);
    }
};

/* ===============================
ADD DRINK
=============================== */
window.addDrink = async function() {
    const name = document.getElementById("drinkName").value.trim();
    const price = document.getElementById("drinkPrice").value;
    const photoInput = document.getElementById("drinkPhoto");

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
        await addDoc(collection(db, "drinks"), {
            name,
            price: Number(price),
            photo: photoUrl
        });

        alert("Drink added!");
        document.getElementById("drinkName").value = "";
        document.getElementById("drinkPrice").value = "";
        photoInput.value = "";

        loadDrinks();
    } catch (err) {
        console.log(err);
        alert("Failed to add drink");
    }
};

/* ===============================
ORDER DRINK
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
AUTO LOAD DRINK LIST
=============================== */
loadDrinks();
