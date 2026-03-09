// =========================
// IMPORT FIREBASE
// =========================
import { auth, db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// =========================
// CHECK LOGIN STATE
// =========================
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location = "index.html";
    }
});


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
        const q = query(
            collection(db, "users"),
            where("email", "==", user.email)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert("Access denied");
            return;
        }

        const role = snapshot.docs[0].data().role;


        // =========================
        // ROLE PERMISSIONS
        // =========================
        if (role !== "manager") {

            if (pageId === "staffPage") {
                alert("Only manager allowed");
                return;
            }

        }


        // =========================
        // HIDE ALL PAGES
        // =========================
        document.querySelectorAll(".page").forEach(p => {
            p.style.display = "none";
        });


        // =========================
        // SHOW SELECTED PAGE
        // =========================
        const page = document.getElementById(pageId);

        if (page) {
            page.style.display = "block";
        }


        // =========================
        // LOAD MODULES
        // =========================
        if (pageId === "staffPage" && typeof loadStaff === "function") {
            loadStaff();
        }

        if (pageId === "orderPage") {

            if (typeof loadOrders === "function") loadOrders();

            if (typeof loadRoleOrders === "function") loadRoleOrders();

        }

        if (pageId === "restaurant" && typeof loadFoods === "function") {
            loadFoods();
        }

        if (pageId === "drinks" && typeof loadDrinks === "function") {
            loadDrinks();
        }

        if (pageId === "finance" && typeof loadFinance === "function") {
            loadFinance();
        }

    } catch (error) {

        console.log("Page load error:", error);

    }

};


// =========================
// DASHBOARD STATISTICS
// =========================
async function loadDashboardStats() {

    try {

        // =========================
        // ROOMS
        // =========================
        const roomsSnap = await getDocs(collection(db, "rooms"));

        let totalRooms = roomsSnap.size;
        let occupiedRooms = 0;

        roomsSnap.forEach(r => {

            if (r.data().status === "Occupied") {
                occupiedRooms++;
            }

        });


        // =========================
        // FOODS
        // =========================
        const foodSnap = await getDocs(collection(db, "foods"));
        const drinkSnap = await getDocs(collection(db, "drinks"));

        let totalFoods = foodSnap.size;
        let totalDrinks = drinkSnap.size;


        // =========================
        // TODAY STATS
        // =========================
        let todayRevenue = 0;
        let todayBookings = 0;
        let todayOrders = 0;

        const billingSnap = await getDocs(collection(db, "billing"));

        const today = new Date().toISOString().split("T")[0];


        billingSnap.forEach(doc => {

            const data = doc.data();

            const date = data.date
                ? data.date.split("T")[0]
                : null;

            if (date === today) {

                todayRevenue += data.price || 0;

                if (data.type === "room") {
                    todayBookings++;
                }

                if (data.type === "food" || data.type === "drink") {
                    todayOrders++;
                }

            }

        });


        // =========================
        // UPDATE UI
        // =========================
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value;
        };

        setText("totalRooms", totalRooms);
        setText("occupiedRooms", occupiedRooms);
        setText("totalFoods", totalFoods);
        setText("totalDrinks", totalDrinks);

        setText("todayRevenue", "$" + todayRevenue.toFixed(2));
        setText("todayBookings", todayBookings);
        setText("todayOrders", todayOrders);


        // =========================
        // TODAY DATE
        // =========================
        const todayDateEl = document.getElementById("todayDate");

        if (todayDateEl) {

            const options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            };

            todayDateEl.innerText =
                new Date().toLocaleDateString(undefined, options);

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
// MENU TOGGLE
// =========================
const dashboardMenu = document.getElementById("dashboardMenu");
const dashboardSubmenu = document.getElementById("dashboardSubmenu");

if (dashboardMenu && dashboardSubmenu) {

    dashboardMenu.addEventListener("click", function (e) {

        e.stopPropagation();

        const visible = dashboardSubmenu.style.display === "block";

        dashboardSubmenu.style.display =
            visible ? "none" : "block";

    });

}


// =========================
// CLOSE MENU OUTSIDE CLICK
// =========================
document.addEventListener("click", function () {

    if (dashboardSubmenu) {
        dashboardSubmenu.style.display = "none";
    }

});

// =========================
// AUTO LOAD DASHBOARD
// =========================
loadDashboardStats();
