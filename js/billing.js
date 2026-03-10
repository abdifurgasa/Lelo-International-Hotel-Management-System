// js/billing.js
import { db } from "./firebase.js"; // your firebase config
import { setLanguage } from "./i18n.js";

// DOM Elements
const billingList = document.getElementById("billingList");
const addBillForm = document.getElementById("addBillForm"); // assume a form in HTML
const guestSelect = document.getElementById("guestSelect"); // select guest user
const billType = document.getElementById("billType");
const billPrice = document.getElementById("billPrice");
const billPayment = document.getElementById("billPayment"); // Cash / Transfer

// Add bill
export async function addBill() {
    const guest = guestSelect.value;
    const type = billType.value;
    const price = parseFloat(billPrice.value);
    const paymentMethod = billPayment.value;

    if (!guest || !type || !price) return alert("All fields are required");

    const id = Date.now();

    const billData = {
        id,
        guest,
        type,
        price,
        status: "Pending",
        paymentMethod,
        createdAt: new Date().toISOString()
    };

    // Save to Firebase under bills collection
    await db.collection("bills").doc(id.toString()).set(billData);

    renderBills();
}

// Render bills
export async function renderBills() {
    const snapshot = await db.collection("bills").get();
    billingList.innerHTML = "";

    snapshot.forEach(doc => {
        const bill = doc.data();
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${bill.guest}</td>
            <td data-i18n="type">${bill.type}</td>
            <td data-i18n="price">${bill.price}</td>
            <td data-i18n="status">${bill.status}</td>
            <td>${bill.paymentMethod}</td>
            <td>
                ${bill.status === "Pending" ? `<button onclick="payBill('${bill.id}')" data-i18n="pay">Pay</button>` : ""}
                <button onclick="deleteBill('${bill.id}')">Delete</button>
            </td>
        `;
        billingList.appendChild(tr);
    });

    // Update i18n labels
    setLanguage(document.getElementById("langSelect").value);
}

// Pay bill
window.payBill = async function(id) {
    const billRef = db.collection("bills").doc(id);
    const billSnap = await billRef.get();
    if (!billSnap.exists) return;

    const bill = billSnap.data();

    // Update bill status
    await billRef.update({ status: "Paid", paidAt: new Date().toISOString() });

    // Update guest service user balance
    const userRef = db.collection("users").doc(bill.guest);
    await db.runTransaction(async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const oldBalance = userSnap.data().balance || 0;
        transaction.update(userRef, { balance: oldBalance - bill.price });
    });

    // Update finance revenue
    const financeRef = db.collection("finance").doc("revenue");
    await db.runTransaction(async (transaction) => {
        const financeSnap = await transaction.get(financeRef);
        const oldRevenue = financeSnap.exists ? financeSnap.data().total : 0;
        transaction.set(financeRef, { total: oldRevenue + bill.price }, { merge: true });
    });

    renderBills();
}

// Delete bill
window.deleteBill = async function(id) {
    await db.collection("bills").doc(id).delete();
    renderBills();
}

// Initial load
renderBills();
