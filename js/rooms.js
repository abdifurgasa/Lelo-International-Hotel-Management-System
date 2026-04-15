function addRoom() {
    const room = document.getElementById("roomNumber").value;

    if (!room) return alert("Enter room");

    const div = document.createElement("div");
    div.textContent = "Room: " + room;

    document.getElementById("roomList").appendChild(div);
}

window.addRoom = addRoom;
