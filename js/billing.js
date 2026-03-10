// billing.js
import { db } from "./firebase.js";
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateFinance } from "./finance.js"; // finance updates

const billingListEl = document.getElementById("billingList");

// Load all bills
export async function loadBilling() {
    billingListEl.innerHTML = "";
    const snapshot = await getDocs(collection(db, "billing"));
    snapshot.forEach(async (docSnap) => {
        const data = docSnap.data();
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${data.user}</td>
            <td>${data.item}</td>
            <td>${data.type}</td>
            <td>$${data.price}</td>
            <td>${data.status}</td>
            <td>
                <select id="paymentMethod_${docSnap.id}">
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Transfer">Transfer</option>
                </select>
            </td>
            <td>
                <button onclick="payBill('${docSnap.id}', ${data.price})">Pay</button>
            </td>
        `;
        billingListEl.appendChild(tr);
    });
}

// Pay a bill
export async function payBill(billId, amount) {
    const selectEl = document.getElementById(`paymentMethod_${billId}`);
    const method = selectEl.value;
    if (!method) return alert("Please select payment method");

    // Update bill status to Paid
    const billRef = doc(db, "billing", billId);
    await updateDoc(billRef, {
        status: "Paid",
        paymentMethod: method
    });

    // Update finance
    await updateFinance(amount, method);

    alert("Bill paid and Finance updated!");
    loadBilling();
}
