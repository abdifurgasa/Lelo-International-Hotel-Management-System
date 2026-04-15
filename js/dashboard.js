import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};
import { loadRooms } from "./rooms.js";

window.addEventListener("load", () => {
    loadRooms();
});
import { loadOrders } from "./order.js";

window.addEventListener("load", () => {
    loadOrders();
});
import { loadStaff } from "./staff.js";

window.addEventListener("load", () => {
    loadStaff();
});
