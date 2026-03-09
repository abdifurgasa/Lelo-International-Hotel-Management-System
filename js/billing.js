import { db } from "./firebase.js";
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
LOAD BILLING ITEMS
=============================== */
window.loadBilling = async function() {
    const tbody = document.getElementById("billingList");
    if (!tbody) return;
    tbody.innerHTML = "";

    try {
        const billingSnap = await getDocs(collection(db, "billing"));
        billingSnap.forEach(docSnap => {
            const bill = docSnap.data();
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${bill.guest}</td>
                <td>${bill.name}</td>
                <td>${bill.itemType}</td>
                <td>$${bill.price}</td>
                <td>${bill.status}</td>
                <td>
                    ${bill.status === "Pending" ? `<button onclick="markPaid('${docSnap.id}')">Mark Paid</button>` : ""}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.log("Load billing error:", err);
    }
};

/* ===============================
MARK BILLING AS PAID
=============================== */
window.markPaid = async function(billId) {
    try {
        const billRef = doc(db, "billing", billId);
        await updateDoc(billRef, { status: "Paid" });
        alert("Billing marked as Paid!");
        loadBilling();
    } catch (err) {
        console.log(err);
        alert("Failed to update billing");
    }
};

/* ===============================
AUTO LOAD BILLING
=============================== */
loadBilling();
