import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let editingStaffId = null;

// ADD / UPDATE STAFF
export async function addStaff() {
    const email = document.getElementById("staffEmail").value;
    const role = document.getElementById("staffRole")?.value || "worker";

    if (!email) return alert("Enter email");

    if (editingStaffId) {
        await updateDoc(doc(db, "staff", editingStaffId), {
            email,
            role
        });
        editingStaffId = null;
    } else {
        await addDoc(collection(db, "staff"), {
            email,
            role,
            createdAt: new Date()
        });
    }

    document.getElementById("staffEmail").value = "";
    loadStaff();
}

// LOAD STAFF
export async function loadStaff() {
    const staffList = document.getElementById("staffList");
    staffList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "staff"));

    snapshot.forEach((d) => {
        const data = d.data();

        const div = document.createElement("div");
        div.innerHTML = `
            ${data.email} (${data.role})
            <button onclick="editStaff('${d.id}', '${data.email}', '${data.role}')">Edit</button>
            <button onclick="deleteStaff('${d.id}')">Delete</button>
        `;

        staffList.appendChild(div);
    });
}

// EDIT STAFF
window.editStaff = function (id, email, role) {
    document.getElementById("staffEmail").value = email;
    if (document.getElementById("staffRole")) {
        document.getElementById("staffRole").value = role;
    }
    editingStaffId = id;
};

// DELETE STAFF
export async function deleteStaff(id) {
    await deleteDoc(doc(db, "staff", id));
    loadStaff();
}

window.addStaff = addStaff;
window.loadStaff = loadStaff;
window.deleteStaff = deleteStaff;
