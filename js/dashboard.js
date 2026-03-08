import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
collection,
query,
where,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js";

/* Login Protection */

onAuthStateChanged(auth,user=>{
if(!user){
window.location.href="index.html";
}
});

/* Rooms Count */

onSnapshot(collection(db,"rooms"), snapshot=>{
document.getElementById("roomCount").innerText = snapshot.size;
});

/* Booking Count */

onSnapshot(collection(db,"bookings"), snapshot=>{
document.getElementById("bookingCount").innerText = snapshot.size;
});

/* Food Orders */

onSnapshot(query(collection(db,"orders"),where("type","==","food")), snapshot=>{
document.getElementById("foodCount").innerText = snapshot.size;
});

/* Drink Orders */

onSnapshot(query(collection(db,"orders"),where("type","==","drink")), snapshot=>{
document.getElementById("drinkCount").innerText = snapshot.size;
});

/* Billing */

onSnapshot(collection(db,"finance"), snapshot=>{
document.getElementById("billingCount").innerText = snapshot.size;

let revenue=0;

snapshot.forEach(doc=>{
let d=doc.data();
if(d.amount) revenue+=Number(d.amount);
});

updateRevenueChart(revenue);

});

/* Revenue Chart */

function updateRevenueChart(value){

const canvas=document.getElementById("revenueChart");
if(!canvas) return;

new Chart(canvas,{
type:"doughnut",

data:{
labels:["Revenue","Remaining"],

datasets:[{
data:[value,1000-value],
backgroundColor:["#22c55e","#e5e7eb"]
}]
},

options:{
plugins:{legend:{display:false}},
responsive:true
}

});

}

/* Logout */

document.getElementById("logout").onclick=()=>{

signOut(auth).then(()=>{
window.location.href="index.html";
});

};
