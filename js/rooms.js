import { db } from "./firebase.js";
import { collection, addDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Load rooms
export async function loadRooms() {
    const roomList = document.getElementById("roomList");
    roomList.innerHTML = "";
    const roomsSnap = await getDocs(collection(db, "rooms"));

    roomsSnap.forEach(room => {
        const data = room.data();
        const card = document.createElement("div");
        card.className = "cardItem";
        card.innerHTML = `
            <img src="${data.photo || 'https://via.placeholder.com/180'}" />
            <h4>Room ${data.number}</h4>
            <p>${data.type} - $${data.price}</p>
            <p>Status: ${data.status}</p>
        `;
        // Click to book
        card.addEventListener("click", async () => {
            if (data.status === "Occupied") return alert("Room already occupied");
            await addDoc(collection(db, "billing"), {
                guest: "Guest", // replace with user
                type: "room",
                item: `Room ${data.number}`,
                price: data.price,
                status: "Pending",
                payment: "Cash",
                date: new Date().toISOString()
            });
            await updateDoc(doc(db, "rooms", room.id), { status: "Occupied" });
            alert(`Room ${data.number} booked!`);
            loadRooms(); // refresh
        });
        roomList.appendChild(card);
    });
}

// Add Room function
export async function addRoom() {
    const number = document.getElementById("roomNumber").value;
    const type = document.getElementById("roomType").value;
    const price = parseFloat(document.getElementById("roomPrice").value);
    const photo = document.getElementById("roomPhoto").files[0] ? URL.createObjectURL(document.getElementById("roomPhoto").files[0]) : '';

    if (!number || !type || !price) return alert("Fill all fields");

    await addDoc(collection(db, "rooms"), {
        number, type, price, photo, status: "Available"
    });

    alert("Room added!");
    loadRooms();
}
