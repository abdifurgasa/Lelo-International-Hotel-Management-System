import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
collection,
onSnapshot,
query,
where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js";


// ===============================
// ENTERPRISE AUTH PROTECTION
// ===============================

onAuthStateChanged(auth,user=>{

if(!user){
window.location.href="index.html";
}

});


// ===============================
// REAL TIME ROOM ANALYTICS
// ===============================

onSnapshot(collection(db,"rooms"), snapshot=>{
document.getElementById("roomCount").innerText = snapshot.size;
});


// ===============================
// FOOD ORDERS ANALYTICS
// ===============================

onSnapshot(
query(collection(db,"orders"),where("type","==","food")),
snapshot=>{
document.getElementById("foodCount").innerText = snapshot.size;
});


// ===============================
// DRINK ORDERS ANALYTICS
// ===============================

onSnapshot(
query(collection(db,"orders"),where("type","==","drink")),
snapshot=>{
document.getElementById("drinkCount").innerText = snapshot.size;
});


// ===============================
// ENTERPRISE REVENUE CALCULATION
// ===============================

onSnapshot(collection(db,"finance"), snapshot=>{

let totalRevenue = 0;

snapshot.forEach(doc=>{
const data = doc.data();
if(data.amount){
totalRevenue += Number(data.amount);
}
});

updateRevenueChart(totalRevenue);

});


// ===============================
// REVENUE CHART ENGINE
// ===============================

function updateRevenueChart(value){

const revenueCanvas = document.getElementById("revenueChart");

if(!revenueCanvas) return;

new Chart(revenueCanvas,{
type:"doughnut",

data:{
labels:["Revenue","Remaining"],

datasets:[{
data:[value,1000-value],

backgroundColor:["#22c55e","#e5e7eb"]
}]
},

options:{
responsive:true,
plugins:{
legend:{display:false}
}
});

}


// ===============================
// LOGOUT ENGINE
// ===============================

const logoutBtn = document.getElementById("logout");

if(logoutBtn){

logoutBtn.onclick=()=>{

signOut(auth).then(()=>{
window.location.href="index.html";
});

};

}
