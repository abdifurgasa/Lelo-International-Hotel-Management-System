// staff.js
import { db } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const staffListEl = document.getElementById("staffList");

// Add Staff
export async function addStaff() {
    const email = document.getElementById("staffEmail").value;
    const password = document.getElementById("staffPassword").value;
    const role = document.getElementById("staffRole").value;

    if (!email || !password || !role) return alert("Fill all fields");

    await addDoc(collection(db, "staff"), {
        email,
        password,
        role,
        fullName: email.split("@")[0] // simple example for full name
    });

    alert("Staff added!");
    loadStaff();
}

// Load Staff List
export async function loadStaff() {
    staffListEl.innerHTML = "";
    const snapshot = await getDocs(collection(db, "staff"));
    snapshot.forEach(docSnap => {
        const staff = docSnap.data();
        const card = document.createElement("div");
        card.className = "cardItem";
        card.innerHTML = `
            <h4>${staff.fullName}</h4>
            <p>Email: ${staff.email}</p>
            <p>Role: ${staff.role}</p>
            <button onclick="deleteStaff('${docSnap.id}')">Delete</button>
        `;
        staffListEl.appendChild(card);
    });
}

// Delete Staff
export async function deleteStaff(staffId) {
    const confirmDelete = confirm("Delete this staff?");
    if (!confirmDelete) return;
    await deleteDoc(doc(db, "staff", staffId));
    alert("Staff deleted!");
    loadStaff();
}

// Password show/hide toggle
const toggleStaffPassword = document.getElementById("toggleStaffPassword");
const staffPassword = document.getElementById("staffPassword");

toggleStaffPassword.addEventListener("click", function() {
    const type = staffPassword.getAttribute("type") === "password" ? "text" : "password";
    staffPassword.setAttribute("type", type);
    this.textContent = type === "password" ? "👁️" : "🙈";
});
