// finance.js
import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Elements
const totalRevenueEl = document.getElementById("totalRevenue");
const roomRevenueEl = document.getElementById("roomRevenue");
const foodRevenueEl = document.getElementById("foodRevenue");
const drinkRevenueEl = document.getElementById("drinkRevenue");
const revenueChartEl = document.getElementById("revenueChart");

let revenueData = {
    room: 0,
    food: 0,
    drink: 0
};

// Update finance when a bill is paid
export async function updateFinance(amount, type) {
    switch(type.toLowerCase()) {
        case "room":
            revenueData.room += amount;
            break;
        case "food":
            revenueData.food += amount;
            break;
        case "drink":
            revenueData.drink += amount;
            break;
        default:
            console.warn("Unknown type for finance:", type);
    }
    await saveFinanceData();
    renderFinance();
}

// Save finance data in Firestore
async function saveFinanceData() {
    const financeRef = doc(db, "finance", "main");
    await setDoc(financeRef, {
        roomRevenue: revenueData.room,
        foodRevenue: revenueData.food,
        drinkRevenue: revenueData.drink,
        totalRevenue: revenueData.room + revenueData.food + revenueData.drink,
        timestamp: serverTimestamp()
    });
}

// Load finance data
export async function loadFinance() {
    const financeRef = doc(db, "finance", "main");
    const snapshot = await getDocs(collection(db, "finance"));
    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        revenueData.room = data.roomRevenue || 0;
        revenueData.food = data.foodRevenue || 0;
        revenueData.drink = data.drinkRevenue || 0;
    });
    renderFinance();
}

// Render finance totals + chart
function renderFinance() {
    totalRevenueEl.textContent = `$${revenueData.room + revenueData.food + revenueData.drink}`;
    roomRevenueEl.textContent = `$${revenueData.room}`;
    foodRevenueEl.textContent = `$${revenueData.food}`;
    drinkRevenueEl.textContent = `$${revenueData.drink}`;

    // Chart.js
    if(window.revenueChart) window.revenueChart.destroy();
    window.revenueChart = new Chart(revenueChartEl, {
        type: "pie",
        data: {
            labels: ["Rooms", "Food", "Drinks"],
            datasets: [{
                data: [revenueData.room, revenueData.food, revenueData.drink],
                backgroundColor: ["#00BFFF", "#FFA500", "#8A2BE2"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}
