// finance.js
import { db } from "./firebase.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const totalRevenueEl = document.getElementById("totalRevenue");
const roomRevenueEl = document.getElementById("roomRevenue");
const foodRevenueEl = document.getElementById("foodRevenue");
const drinkRevenueEl = document.getElementById("drinkRevenue");
const revenueChartEl = document.getElementById("revenueChart");

let revenueChart;

// Load finance data
export async function loadFinance() {
    let total = 0, roomTotal = 0, foodTotal = 0, drinkTotal = 0;

    const snapshot = await getDocs(collection(db, "billing"));
    snapshot.forEach(docSnap => {
        const bill = docSnap.data();
        if (bill.status === "Paid") {
            total += bill.price;
            if (bill.type === "room") roomTotal += bill.price;
            if (bill.type === "food") foodTotal += bill.price;
            if (bill.type === "drink") drinkTotal += bill.price;
        }
    });

    totalRevenueEl.innerText = `$${total.toFixed(2)}`;
    roomRevenueEl.innerText = `$${roomTotal.toFixed(2)}`;
    foodRevenueEl.innerText = `$${foodTotal.toFixed(2)}`;
    drinkRevenueEl.innerText = `$${drinkTotal.toFixed(2)}`;

    renderChart(roomTotal, foodTotal, drinkTotal);
}

// Update finance when a bill is paid
export async function updateFinance(amount, method) {
    // Can log method, date etc. in future
    await loadFinance(); // refresh totals
}

// Render Chart.js
function renderChart(room, food, drink) {
    const data = {
        labels: ["Rooms", "Food", "Drinks"],
        datasets: [{
            label: "Revenue ($)",
            data: [room, food, drink],
            backgroundColor: ["#00BFFF", "#FFA500", "#8A2BE2"]
        }]
    };

    const config = {
        type: "bar",
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Revenue by Type" }
            }
        }
    };

    if (revenueChart) revenueChart.destroy();
    revenueChart = new Chart(revenueChartEl, config);
}
