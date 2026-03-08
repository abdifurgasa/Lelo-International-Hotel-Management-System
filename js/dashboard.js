import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js";

// ===============================
// LOGIN PROTECTION
// ===============================

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html"; // redirect if not logged in
  }
});


// ===============================
// ROOMS STATISTICS
// ===============================

onSnapshot(collection(db, "rooms"), snapshot => {
  document.getElementById("roomCount").innerText = snapshot.size;
});


// ===============================
// RESTAURANT (FOOD ORDERS)
// ===============================

onSnapshot(collection(db, "orders"), snapshot => {

  let foodCount = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.type === "food") {
      foodCount++;
    }
  });

  document.getElementById("foodCount").innerText = foodCount;

});


// ===============================
// DRINKS ORDERS
// ===============================

onSnapshot(collection(db, "orders"), snapshot => {

  let drinkCount = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.type === "drink") {
      drinkCount++;
    }
  });

  document.getElementById("drinkCount").innerText = drinkCount;

});


// ===============================
// REVENUE CIRCULAR CHART
// ===============================

const revenueCanvas = document.getElementById("revenueChart");

if (revenueCanvas) {

  new Chart(revenueCanvas, {
    type: "doughnut", // circular chart

    data: {
      labels: ["Revenue Used", "Remaining"],

      datasets: [{
        data: [70, 30], // Example data, replace with real calculation later
        backgroundColor: ["#22c55e", "#e5e7eb"]
      }]
    },

    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    }

  });

}


// ===============================
// LOGOUT SYSTEM
// ===============================

const logoutBtn = document.getElementById("logout");

if (logoutBtn) {

  logoutBtn.addEventListener("click", () => {

    signOut(auth).then(() => {
      // Redirect to login page after logout
      window.location.href = "index.html";
    }).catch(error => {
      console.error("Logout error:", error);
    });

  });

}
