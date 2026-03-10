// rooms.js
import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { addBill } from "./billingHelper.js"; // helper function to add bill to guest service

const roomListEl = document.getElementById("roomList");

// Add Room
export async function addRoom() {
    const number = document.getElementById("roomNumber").value;
    const type = document.getElementById("roomType").value;
    const price = parseFloat(document.getElementById("roomPrice").value);
    const photo = document.getElementById("roomPhoto").files[0];

    if (!number || !type || !price || !photo) return alert("Fill all fields");

    const photoURL = URL.createObjectURL(photo);

    await addDoc(collection(db, "rooms"), {
        number,
        type,
        price,
        photoURL,
        status: "Available"
    });

    loadRooms();
}

// Load Rooms
export async function loadRooms() {
    roomListEl.innerHTML = "";
    const snapshot = await getDocs(collection(db, "rooms"));
    snapshot.forEach(docSnap => {
        const room = docSnap.data();
        const card = document.createElement("div");
        card.className = "cardItem";
        card.innerHTML = `
            <img src="${room.photoURL}" alt="Room ${room.number}">
            <h4>Room ${room.number}</h4>
            <p>Type: ${room.type}</p>
            <p>Price: $${room.price}</p>
            <p>Status: ${room.status}</p>
        `;
        // Click to book
        card.addEventListener("click", () => bookRoom(docSnap.id, room));
        roomListEl.appendChild(card);
    });
}

// Book Room
async function bookRoom(roomId, room) {
    if (room.status === "Occupied") return alert("Room is already occupied!");

    // Get check-in and check-out dates
    const checkIn = prompt("Enter Check-in date (YYYY-MM-DD):");
    const checkOut = prompt("Enter Check-out date (YYYY-MM-DD):");
    if (!checkIn || !checkOut) return;

    // Add billing to Guest Service
    await addBill("guest_service", `Room ${room.number}`, "room", room.price);

    alert(`Room ${room.number} booked from ${checkIn} to ${checkOut}. Bill added to Guest Service.`);

    // Optionally: Update room status
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, { status: "Occupied" });

    loadRooms();
}
