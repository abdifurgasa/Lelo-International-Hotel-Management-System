/* ===============================
IMPORT FIREBASE
=============================== */

import { auth, db } from "./firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


/* ===============================
AUTH CHECK
=============================== */

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location = "index.html";
        return;
    }

    /* Load dashboard automatically */
    loadDashboardStats();
});


/* ===============================
PAGE LOADER
=============================== */

window.loadPage = async function(pageId) {

    const user = auth.currentUser;

    if (!user) {
        window.location = "index.html";
        return;
    }

    try {

        /* ===============================
        GET USER ROLE (IMPROVED)
        =============================== */

        const q = query(collection(db, "users"), where("email", "==", user.email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert("Access denied");
            return;
        }

        const role = snapshot.docs[0].data().role;

        /* ===============================
        ROLE PERMISSIONS
        =============================== */

        if (role !== "manager") {
            if (pageId === "staffPage") {
                alert("Only manager allowed");
                return;
            }
        }

        /* ===============================
        HIDE ALL PAGES
        =============================== */

        document.querySelectorAll(".page").forEach(page => {
            page.style.display = "none";
        });

        /* ===============================
        SHOW SELECTED PAGE
        =============================== */

        const selectedPage = document.getElementById(pageId);

        if (selectedPage) {
            selectedPage.style.display = "block";
        }

        /* ===============================
        LOAD PAGE MODULES
        =============================== */

        if (pageId === "staffPage") {
            if (typeof loadStaff === "function") {
                loadStaff();
            }
        }

        if (pageId === "orderPage") {
            if (typeof loadOrders === "function") {
                loadOrders();
            }
            if (typeof loadRoleOrders === "function") {
                loadRoleOrders();
            }
        }

        if (pageId === "restaurant") {
            if (typeof loadFoods === "function") {
                loadFoods();
            }
        }

        if (pageId === "drinks") {
            if (typeof loadDrinks === "function") {
                loadDrinks();
            }
        }

        if (pageId === "finance") {
            if (typeof loadFinance === "function") {
                loadFinance();
            }
        }

    } catch (error) {
        console.log("Page load error:", error);
    }

};


/* ===============================
DASHBOARD STATS
=============================== */

async function loadDashboardStats() {
    try {

        /* ROOMS */
        const roomsSnap = await getDocs(collection(db, "rooms"));
        let totalRooms = roomsSnap.size;
        let occupiedRooms = 0;
        roomsSnap.forEach(room => {
            if (room.data().status === "Occupied") {
                occupiedRooms++;
            }
        });

        /* FOOD */
        const foodSnap = await getDocs(collection(db, "foods"));
        let totalFoods = foodSnap.size;

        /* DRINK */
        const drinkSnap = await getDocs(collection(db, "drinks"));
        let totalDrinks = drinkSnap.size;

        /* UPDATE UI */
        const totalRoomsEl = document.getElementById("totalRooms");
        const occupiedRoomsEl = document.getElementById("occupiedRooms");
        const totalFoodsEl = document.getElementById("totalFoods");
        const totalDrinksEl = document.getElementById("totalDrinks");

        if (totalRoomsEl) totalRoomsEl.innerText = totalRooms;
        if (occupiedRoomsEl) occupiedRoomsEl.innerText = occupiedRooms;
        if (totalFoodsEl) totalFoodsEl.innerText = totalFoods;
        if (totalDrinksEl) totalDrinksEl.innerText = totalDrinks;

    } catch (error) {
        console.log("Dashboard stats error:", error);
    }
}


/* ===============================
LOGOUT
=============================== */

window.logout = function() {
    if (confirm("Are you sure you want to logout?")) {
        signOut(auth)
            .then(() => {
                window.location = "index.html";
            })
            .catch((error) => {
                console.log("Logout error:", error);
            });
    }
};
