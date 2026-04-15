import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ADD ROOM
export async function addRoom() {
    const roomNumber = document.getElementById("roomNumber").value;

    if (!roomNumber) {
        alert("Enter room number");
        return;
    }

    try {
        await addDoc(collection(db, "rooms"), {
            roomNumber: roomNumber,
            createdAt: new Date()
        });

        document.getElementById("roomNumber").value = "";
        loadRooms();

    } catch (error) {
        console.error("Error adding room:", error);
    }
}

// LOAD ROOMS
export async function loadRooms() {
    const roomList = document.getElementById("roomList");
    roomList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "rooms"));

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        const div = document.createElement("div");
        div.textContent = "Room: " + data.roomNumber;

        roomList.appendChild(div);
    });
}

// expose to HTML
window.addRoom = addRoom;
window.loadRooms = loadRooms;
