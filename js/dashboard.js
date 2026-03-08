import { auth, db } from "./firebase.js";

import {
collection,
getDocs,
query,
where,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ===============================
Page Loader
=============================== */

window.loadPage = async function(page){

const user = auth.currentUser;

if(!user){
window.location="index.html";
return;
}

/* Role Permission Check */

const userDoc = await getDoc(
doc(db,"users",user.email)
);

if(!userDoc.exists()){
alert("Access denied");
return;
}

const role = userDoc.data().role;

/* Permission Mapping */

if(role !== "manager"){

if(page === "staffPage" && role !== "manager"){
alert("Only manager can access staff page");
return;
}

if(page === "food" && role !== "kitchen"){
alert("Kitchen access only");
return;
}

if(page === "drinks" && role !== "barman"){
alert("Barman access only");
return;
}

if(page === "booking" && role !== "reception"){
alert("Reception access only");
return;
}

}

/* Hide All Pages */

let pages = document.querySelectorAll(".page");

pages.forEach(p=>{
p.style.display="none";
});

/* Show Target Page */

let target = document.getElementById(page);

if(target){
target.style.display="block";
}

/* Auto Load Modules */

if(page === "staffPage"){
loadStaff();
}

if(page === "orderPage"){
loadOrders();
loadRoleOrders();
}

}

/* ===============================
Dashboard Statistics (Firebase)
=============================== */

async function loadDashboardStats(){

try{

/* Rooms */

const roomsSnap = await getDocs(collection(db,"rooms"));

let totalRooms = roomsSnap.size;

let occupiedRooms = 0;

roomsSnap.forEach(doc=>{
if(doc.data().status === "Occupied"){
occupiedRooms++;
}
});

/* Foods */

const foodSnap = await getDocs(collection(db,"foods"));

let totalFoods = foodSnap.size;

/* Drinks */

const drinkSnap = await getDocs(collection(db,"drinks"));

let totalDrinks = drinkSnap.size;

/* Update Dashboard UI */

if(document.getElementById("totalRooms"))
document.getElementById("totalRooms").innerText = totalRooms;

if(document.getElementById("occupiedRooms"))
document.getElementById("occupiedRooms").innerText = occupiedRooms;

if(document.getElementById("totalFoods"))
document.getElementById("totalFoods").innerText = totalFoods;

if(document.getElementById("totalDrinks"))
document.getElementById("totalDrinks").innerText = totalDrinks;

}catch(error){
console.log(error);
}

}

/* ===============================
Logout System
=============================== */

window.logout = function(){

if(confirm("Logout?")){

auth.signOut().then(()=>{
window.location="index.html";
});

}

}

/* ===============================
Auto Run Dashboard Stats
=============================== */

loadDashboardStats();
