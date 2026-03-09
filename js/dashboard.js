// =========================
// IMPORT FIREBASE
// =========================
import { auth, db } from "./firebase.js";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =========================
// PAGE LOADER
// =========================
window.loadPage = async function(pageId) {
    const user = auth.currentUser;

    if (!user) {
        window.location = "index.html";
        return;
    }

    try {
        // Get user role
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert("Access denied");
            return;
        }

        const role = snapshot.docs[0].data().role;

        // Role permissions
        if (role !== "manager") {
            if (pageId === "staffPage") {
                alert("Only manager allowed");
                return;
            }
        }

        // Hide all pages
        document.querySelectorAll(".page").forEach(p => {
            p.style.display = "none";
        });

        // Show selected page
        const page = document.getElementById(pageId);
        if (page) page.style.display = "block";

        // Load modules safely
        if (pageId === "staffPage" && typeof loadStaff === "function") loadStaff();
        if (pageId === "orderPage") {
            if (typeof loadOrders === "function") loadOrders();
            if (typeof loadRoleOrders === "function") loadRoleOrders();
        }
        if (pageId === "restaurant" && typeof loadFoods === "function") loadFoods();
        if (pageId === "drinks" && typeof loadDrinks === "function") loadDrinks();
        if (pageId === "finance" && typeof loadFinance === "function") loadFinance();

    } catch (error) {
        console.log("Page load error:", error);
    }
};

// =========================
// DASHBOARD STATS
// =========================
async function loadDashboardStats() {
    try {
        // Rooms
        const roomsSnap = await getDocs(collection(db, "rooms"));
        let totalRooms = roomsSnap.size;
        let occupiedRooms = 0;
        roomsSnap.forEach(r => {
            if (r.data().status === "Occupied") occupiedRooms++;
        });

        // Foods & Drinks
        const foodSnap = await getDocs(collection(db, "foods"));
        const drinkSnap = await getDocs(collection(db, "drinks"));

        let totalFoods = foodSnap.size;
        let totalDrinks = drinkSnap.size;

        // Today Stats (bookings & orders)
        let todayRevenue = 0;
        let todayBookings = 0;
        let todayOrders = 0;

        const billingSnap = await getDocs(collection(db, "billing"));
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        billingSnap.forEach(doc => {
            const data = doc.data();
            const date = data.date ? data.date.split('T')[0] : null;
            if (date === today) {
                todayRevenue += data.price || 0;
                todayBookings += data.type === "room" ? 1 : 0;
                todayOrders += data.type === "food" || data.type === "drink" ? 1 : 0;
            }
        });

        // Update UI
        if (document.getElementById("totalRooms")) document.getElementById("totalRooms").innerText = totalRooms;
        if (document.getElementById("occupiedRooms")) document.getElementById("occupiedRooms").innerText = occupiedRooms;
        if (document.getElementById("totalFoods")) document.getElementById("totalFoods").innerText = totalFoods;
        if (document.getElementById("totalDrinks")) document.getElementById("totalDrinks").innerText = totalDrinks;

        if (document.getElementById("todayRevenue")) document.getElementById("todayRevenue").innerText = "$" + todayRevenue.toFixed(2);
        if (document.getElementById("todayBookings")) document.getElementById("todayBookings").innerText = todayBookings;
        if (document.getElementById("todayOrders")) document.getElementById("todayOrders").innerText = todayOrders;

        // Display today's date in banner
        const todayDateEl = document.getElementById("todayDate");
        if (todayDateEl) {
            const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
            todayDateEl.innerText = new Date().toLocaleDateString(undefined, dateOptions);
        }

    } catch (err) {
        console.log("Dashboard stats error:", err);
    }
}

// =========================
// LOGOUT
// =========================
window.logout = function() {
    if (confirm("Logout?")) {
        auth.signOut().then(() => {
            window.location = "index.html";
        });
    }
};

// =========================
// AUTO LOAD DASHBOARD
// =========================
loadDashboardStats();
// Toggle Dashboard submenu
const dashboardMenu = document.getElementById("dashboardMenu");
const dashboardSubmenu = document.getElementById("dashboardSubmenu");

dashboardMenu.addEventListener("click", function() {
    const isVisible = dashboardSubmenu.style.display === "block";
    dashboardSubmenu.style.display = isVisible ? "none" : "block";
});
