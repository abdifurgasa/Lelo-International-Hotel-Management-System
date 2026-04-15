import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ADD ORDER
export async function addOrder() {
    const item = document.getElementById("orderItem").value;
    const price = document.getElementById("orderPrice")?.value || 0;

    if (!item) {
        alert("Enter order item");
        return;
    }

    try {
        await addDoc(collection(db, "orders"), {
            item: item,
            price: Number(price),
            createdAt: new Date()
        });

        document.getElementById("orderItem").value = "";
        if (document.getElementById("orderPrice")) {
            document.getElementById("orderPrice").value = "";
        }

        loadOrders();

    } catch (error) {
        console.error("Error adding order:", error);
    }
}

// LOAD ORDERS
export async function loadOrders() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "orders"));

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        const div = document.createElement("div");
        div.textContent = `Order: ${data.item} - $${data.price}`;

        orderList.appendChild(div);
    });
}

// expose to HTML
window.addOrder = addOrder;
window.loadOrders = loadOrders;
