import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ADD ROOM
export async function addRoom() {
    const roomNumber = document.getElementById("roomNumber").value;

    if (!roomNumber) return alert("Enter room number");

    await addDoc(collection(db, "rooms"), {
        roomNumber,
        createdAt: new Date()
    });

    document.getElementById("roomNumber").value = "";
    loadRooms();
}

// LOAD ROOMS
export async function loadRooms() {
    const roomList = document.getElementById("roomList");
    roomList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "rooms"));

    snapshot.forEach((docItem) => {
        const data = docItem.data();

        const div = document.createElement("div");
        div.innerHTML = `
            Room: ${data.roomNumber}
            <button onclick="deleteRoom('${docItem.id}')">Delete</button>
        `;

        roomList.appendChild(div);
    });
}

// DELETE ROOM
export async function deleteRoom(id) {
    await deleteDoc(doc(db, "rooms", id));
    loadRooms();
}

window.addRoom = addRoom;
window.loadRooms = loadRooms;
window.deleteRoom = deleteRoom;
