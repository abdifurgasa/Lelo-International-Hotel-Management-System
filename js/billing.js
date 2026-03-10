// billing.js
import { db } from "./firebase.js"; // your Firebase config
import { collection, addDoc, getDocs, query, where, updateDoc, doc, arrayUnion, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Select DOM elements
const billingList = document.getElementById("billingList");

// Load all bills for display
export async function loadBilling() {
    billingList.innerHTML = "";

    const billsSnapshot = await getDocs(collection(db, "bills"));
    billsSnapshot.forEach((billDoc) => {
        const bill = billDoc.data();
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${bill.userEmail || "N/A"}</td>
            <td>${bill.items.map(i => `${i.type}: ${i.name} ($${i.price})`).join("<br>")}</td>
            <td>${bill.items.map(i => i.type).join(", ")}</td>
            <td>$${bill.total}</td>
            <td>${bill.status}</td>
            <td>
                <select onchange="updatePaymentMethod('${billDoc.id}', this.value)">
                    <option value="Cash" ${bill.paymentMethod === "Cash" ? "selected" : ""}>Cash</option>
                    <option value="Transfer" ${bill.paymentMethod === "Transfer" ? "selected" : ""}>Transfer</option>
                </select>
            </td>
            <td>
                ${bill.status === "Pending" ? `<button onclick="payBill('${billDoc.id}')">Mark Paid</button>` : "Paid"}
            </td>
        `;

        billingList.appendChild(row);
    });
}

// Add item to a user’s bill
export async function addToBill(userEmail, item) {
    // Check if there is an existing pending bill for this user
    const q = query(collection(db, "bills"), where("userEmail", "==", userEmail), where("status", "==", "Pending"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        // Append item to existing bill
        const billDoc = snapshot.docs[0];
        const newTotal = snapshot.docs[0].data().total + item.price;

        await updateDoc(doc(db, "bills", billDoc.id), {
            items: arrayUnion(item),
            total: newTotal
        });
    } else {
        // Create new bill
        await addDoc(collection(db, "bills"), {
            userEmail: userEmail,
            items: [item],
            total: item.price,
            status: "Pending",
            paymentMethod: "Cash",
            createdAt: serverTimestamp()
        });
    }

    loadBilling();
    updateFinance(item);
}

// Mark bill as paid
window.payBill = async function (billId) {
    const billRef = doc(db, "bills", billId);
    const billSnap = await getDocs(query(collection(db, "bills"), where("id", "==", billId)));

    await updateDoc(billRef, { status: "Paid" });

    // Optionally, update user balance
    // You can fetch user doc and subtract bill.total from balance

    loadBilling();
}

// Update payment method
window.updatePaymentMethod = async function (billId, method) {
    const billRef = doc(db, "bills", billId);
    await updateDoc(billRef, { paymentMethod: method });
}

// Update finance collection
async function updateFinance(item) {
    // Fetch finance document (assume one doc with id 'main')
    const financeRef = doc(db, "finance", "main");
    const financeSnap = await getDocs(collection(db, "finance"));

    if (financeSnap.empty) {
        // Create finance doc
        await addDoc(collection(db, "finance"), {
            totalRevenue: item.price,
            revenueByType: {
                room: item.type === "room" ? item.price : 0,
                food: item.type === "food" ? item.price : 0,
                drink: item.type === "drink" ? item.price : 0
            },
            payments: []
        });
    } else {
        const financeDoc = financeSnap.docs[0];
        const financeData = financeDoc.data();

        const updatedRevenue = financeData.totalRevenue + item.price;
        const updatedByType = {...financeData.revenueByType};
        if (item.type === "room") updatedByType.room += item.price;
        if (item.type === "food") updatedByType.food += item.price;
        if (item.type === "drink") updatedByType.drink += item.price;

        await updateDoc(doc(db, "finance", financeDoc.id), {
            totalRevenue: updatedRevenue,
            revenueByType: updatedByType,
            payments: arrayUnion({ type: item.type, amount: item.price, date: new Date() })
        });
    }
}
