import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ===============================
// Dashboard Protection + Role System
// ===============================

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="index.html";
return;
}


// Get user profile from Firestore
const userRef = doc(db,"users",user.uid);
const snap = await getDoc(userRef);

if(!snap.exists()){
alert("User profile not found");
return;
}

const role = snap.data().role;

console.log("Logged Role:",role);


// ===== Role Dashboard Routing (Ready Structure) =====

switch(role){

case "admin":
console.log("Admin Dashboard");
break;

case "manager":
console.log("Manager Dashboard");
break;

case "reception":
console.log("Reception Dashboard");
break;

case "worker":
console.log("Worker Dashboard");
break;

case "kitchen":
console.log("Kitchen Dashboard");
break;

case "barman":
console.log("Barman Dashboard");
break;

case "finance":
console.log("Finance Dashboard");
break;

default:
alert("Access denied");
window.location.href="index.html";

}

});


// ===============================
// Logout System
// ===============================

const logoutBtn = document.getElementById("logout");

if(logoutBtn){

logoutBtn.onclick=()=>{

signOut(auth).then(()=>{
window.location.href="index.html";
});

};

}


// ===============================
// Circular Chart (Hotel Statistics)
// ===============================

const ctx = document.getElementById("chart");

if(ctx){

new Chart(ctx,{
type:"doughnut",

data:{
labels:["Rooms","Bookings","Revenue","Orders"],

datasets:[{
label:"Hotel Statistics",

data:[40,30,20,10],

backgroundColor:[
"#0ea5e9",
"#22c55e",
"#f59e0b",
"#ef4444"
]

}]
},

options:{
responsive:true,

plugins:{
legend:{
position:"bottom"
}
}

}

});

}
