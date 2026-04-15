import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ADD ORDER
export async function addOrder() {
    const item = document.getElementById("orderItem").value;
    const price = document.getElementById("orderPrice")?.value || 0;

    if (!item) return alert("Enter order");

    await addDoc(collection(db, "orders"), {
        item,
        price: Number(price),
        createdAt: new Date()
    });

    document.getElementById("orderItem").value = "";
    if (document.getElementById("orderPrice")) {
        document.getElementById("orderPrice").value = "";
    }

    loadOrders();
}

// LOAD ORDERS
export async function loadOrders() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "orders"));

    snapshot.forEach((docItem) => {
        const data = docItem.data();

        const div = document.createElement("div");
        div.innerHTML = `
            ${data.item} - $${data.price}
            <button onclick="deleteOrder('${docItem.id}')">Delete</button>
        `;

        orderList.appendChild(div);
    });
}

// DELETE ORDER
export async function deleteOrder(id) {
    await deleteDoc(doc(db, "orders", id));
    loadOrders();
}

window.addOrder = addOrder;
window.loadOrders = loadOrders;
window.deleteOrder = deleteOrder;
