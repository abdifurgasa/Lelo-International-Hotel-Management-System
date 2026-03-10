// js/billing.js
import { db, auth } from "./firebase.js"; // your firebase config file
import { setLanguage } from "./i18n.js";

// ==================== BILLING ====================
const billingList = document.getElementById("billingList");

// Example: store bills in memory (or fetch from Firebase)
let bills = []; // each bill: {id, guest, type, price, status, paymentMethod}

// ==================== ADD BILL ====================
export function addBill(guest, type, price, paymentMethod) {
    const id = Date.now();
    const bill = {
        id,
        guest,
        type,
        price,
        status: "Pending",
        paymentMethod
    };
    bills.push(bill);
    renderBills();
    // TODO: save to Firebase under guest user
}

// ==================== RENDER BILLS ====================
function renderBills() {
    billingList.innerHTML = "";
    bills.forEach(bill => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${bill.guest}</td>
            <td data-i18n="type">${bill.type}</td>
            <td data-i18n="price">${bill.price}</td>
            <td data-i18n="status">${bill.status}</td>
            <td>${bill.paymentMethod}</td>
            <td>
                ${bill.status === "Pending" ? `<button onclick="payBill(${bill.id})" data-i18n="pay">Pay</button>` : ""}
                <button onclick="deleteBill(${bill.id})">Delete</button>
            </td>
        `;
        billingList.appendChild(tr);
    });
    setLanguage(document.getElementById("langSelect").value); // update i18n
}

// ==================== PAY BILL ====================
window.payBill = function(id) {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    bill.status = "Paid";

    // TODO: update guest user balance in Firebase
    // TODO: add amount to finance revenue
    renderBills();
}

// ==================== DELETE BILL ====================
window.deleteBill = function(id) {
    bills = bills.filter(b => b.id !== id);
    renderBills();
}

// ==================== INITIAL LOAD ====================
renderBills();
