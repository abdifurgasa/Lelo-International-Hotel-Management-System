import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ADD STAFF
export async function addStaff() {
    const email = document.getElementById("staffEmail").value;
    const role = document.getElementById("staffRole")?.value || "worker";

    if (!email) return alert("Enter email");

    await addDoc(collection(db, "staff"), {
        email,
        role,
        createdAt: new Date()
    });

    document.getElementById("staffEmail").value = "";
    loadStaff();
}

// LOAD STAFF
export async function loadStaff() {
    const staffList = document.getElementById("staffList");
    staffList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "staff"));

    snapshot.forEach((docItem) => {
        const data = docItem.data();

        const div = document.createElement("div");
        div.innerHTML = `
            ${data.email} (${data.role})
            <button onclick="deleteStaff('${docItem.id}')">Delete</button>
        `;

        staffList.appendChild(div);
    });
}

// DELETE STAFF
export async function deleteStaff(id) {
    await deleteDoc(doc(db, "staff", id));
    loadStaff();
}

window.addStaff = addStaff;
window.loadStaff = loadStaff;
window.deleteStaff = deleteStaff;
