import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ADD STAFF
export async function addStaff() {
    const email = document.getElementById("staffEmail").value;
    const role = document.getElementById("staffRole")?.value || "worker";

    if (!email) {
        alert("Enter staff email");
        return;
    }

    try {
        await addDoc(collection(db, "staff"), {
            email: email,
            role: role,
            createdAt: new Date()
        });

        document.getElementById("staffEmail").value = "";

        loadStaff();

    } catch (error) {
        console.error("Error adding staff:", error);
    }
}

// LOAD STAFF
export async function loadStaff() {
    const staffList = document.getElementById("staffList");
    staffList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "staff"));

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        const div = document.createElement("div");
        div.textContent = `Staff: ${data.email} (${data.role})`;

        staffList.appendChild(div);
    });
}

// expose to HTML
window.addStaff = addStaff;
window.loadStaff = loadStaff;
