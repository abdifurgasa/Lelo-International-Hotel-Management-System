import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
LOAD STAFF LIST
=============================== */
window.loadStaff = async function() {
    const list = document.getElementById("staffList");
    if (!list) return;
    list.innerHTML = "";

    try {
        const staffSnap = await getDocs(collection(db, "users"));
        staffSnap.forEach(doc => {
            const staff = doc.data();
            const div = document.createElement("div");
            div.className = "roomCard"; // reuse style
            div.innerHTML = `
                <h4>${staff.email}</h4>
                <p>Role: ${staff.role}</p>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        console.log("Load staff error:", err);
    }
};

/* ===============================
ADD STAFF
=============================== */
window.addStaff = async function() {
    const email = document.getElementById("staffEmail").value.trim();
    const password = document.getElementById("staffPassword").value.trim();
    const role = document.getElementById("staffRole").value;

    if (!email || !password || !role) {
        alert("Please fill all fields");
        return;
    }

    try {
        await addDoc(collection(db, "users"), {
            email,
            password, // In production, password should be hashed!
            role
        });

        alert("Staff added successfully!");
        document.getElementById("staffEmail").value = "";
        document.getElementById("staffPassword").value = "";

        loadStaff();
    } catch (err) {
        console.log(err);
        alert("Failed to add staff");
    }
};

/* ===============================
AUTO LOAD STAFF LIST
=============================== */
loadStaff();
