import { db } from "./firebase.js";
import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ===============================
LOAD ROOM LIST
=============================== */

window.loadRooms = async function() {

    const roomTable = document.getElementById("roomTable");
    if (!roomTable) return;

    roomTable.innerHTML = ""; // clear table

    try {
        const roomsSnap = await getDocs(collection(db, "rooms"));
        roomsSnap.forEach(doc => {
            const room = doc.data();
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${room.photo ? `<img src="${room.photo}" width="50">` : ""}</td>
                <td>${room.number}</td>
                <td>${room.type}</td>
                <td>${room.price}</td>
                <td>${room.status || "Available"}</td>
            `;
            roomTable.appendChild(tr);
        });
    } catch (error) {
        console.log("Load rooms error:", error);
    }
};


/* ===============================
ADD ROOM
=============================== */

window.addRoom = async function() {

    const number = document.getElementById("roomNumber").value.trim();
    const type = document.getElementById("roomType").value;
    const price = document.getElementById("roomPrice").value;
    const photoInput = document.getElementById("roomPhoto");

    if (!number || !type || !price) {
        alert("Please fill all fields");
        return;
    }

    /* Optional: convert photo to base64 */
    let photoUrl = "";
    if (photoInput && photoInput.files.length > 0) {
        const file = photoInput.files[0];
        photoUrl = await toBase64(file);
    }

    try {
        await addDoc(collection(db, "rooms"), {
            number: number,
            type: type,
            price: Number(price),
            photo: photoUrl,
            status: "Available"
        });

        alert("Room added successfully!");

        // Clear input
        document.getElementById("roomNumber").value = "";
        document.getElementById("roomPrice").value = "";
        photoInput.value = "";

        // Reload room list
        loadRooms();

    } catch (error) {
        console.log("Add room error:", error);
        alert("Failed to add room");
    }
};


/* ===============================
HELPER: convert file to Base64
=============================== */

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


/* ===============================
AUTO LOAD ROOM LIST
=============================== */

loadRooms();
