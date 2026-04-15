import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let editingOrderId = null;

// ADD / UPDATE ORDER
export async function addOrder() {
    const item = document.getElementById("orderItem").value;
    const price = document.getElementById("orderPrice")?.value || 0;

    if (!item) return alert("Enter order item");

    if (editingOrderId) {
        await updateDoc(doc(db, "orders", editingOrderId), {
            item,
            price: Number(price)
        });
        editingOrderId = null;
    } else {
        await addDoc(collection(db, "orders"), {
            item,
            price: Number(price),
            createdAt: new Date()
        });
    }

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

    snapshot.forEach((d) => {
        const data = d.data();

        const div = document.createElement("div");
        div.innerHTML = `
            ${data.item} - ${data.price}
            <button onclick="editOrder('${d.id}', '${data.item}', '${data.price}')">Edit</button>
            <button onclick="deleteOrder('${d.id}')">Delete</button>
        `;

        orderList.appendChild(div);
    });
}

// EDIT ORDER
window.editOrder = function (id, item, price) {
    document.getElementById("orderItem").value = item;
    if (document.getElementById("orderPrice")) {
        document.getElementById("orderPrice").value = price;
    }
    editingOrderId = id;
};

// DELETE ORDER
export async function deleteOrder(id) {
    await deleteDoc(doc(db, "orders", id));
    loadOrders();
}

window.addOrder = addOrder;
window.loadOrders = loadOrders;
window.deleteOrder = deleteOrder;
