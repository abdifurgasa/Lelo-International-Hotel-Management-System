import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let editingRoomId = null;

// ADD / UPDATE ROOM
export async function addRoom() {
    const roomNumber = document.getElementById("roomNumber").value;

    if (!roomNumber) return alert("Enter room number");

    if (editingRoomId) {
        await updateDoc(doc(db, "rooms", editingRoomId), {
            roomNumber
        });
        editingRoomId = null;
    } else {
        await addDoc(collection(db, "rooms"), {
            roomNumber,
            createdAt: new Date()
        });
    }

    document.getElementById("roomNumber").value = "";
    loadRooms();
}

// LOAD ROOMS
export async function loadRooms() {
    const roomList = document.getElementById("roomList");
    roomList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "rooms"));

    snapshot.forEach((d) => {
        const data = d.data();

        const div = document.createElement("div");
        div.innerHTML = `
            Room: ${data.roomNumber}
            <button onclick="editRoom('${d.id}', '${data.roomNumber}')">Edit</button>
            <button onclick="deleteRoom('${d.id}')">Delete</button>
        `;

        roomList.appendChild(div);
    });
}

// EDIT ROOM
window.editRoom = function (id, roomNumber) {
    document.getElementById("roomNumber").value = roomNumber;
    editingRoomId = id;
};

// DELETE ROOM
export async function deleteRoom(id) {
    await deleteDoc(doc(db, "rooms", id));
    loadRooms();
}

window.addRoom = addRoom;
window.loadRooms = loadRooms;
window.deleteRoom = deleteRoom;
