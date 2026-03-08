import { auth, db } from "./firebase.js";
import {
collection,
getDocs,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ===============================
PAGE LOADER
=============================== */

window.loadPage = async function(pageId){

const user = auth.currentUser;

if(!user){
window.location = "index.html";
return;
}

try{

/* Get User Role */

const userDoc = await getDoc(doc(db,"users",user.email));

if(!userDoc.exists()){
alert("Access denied");
return;
}

const role = userDoc.data().role;

/* ROLE PERMISSIONS */

if(role !== "manager"){

if(pageId === "staffPage"){
alert("Only manager allowed");
return;
}

}

/* Hide all pages */

document.querySelectorAll(".page").forEach(p=>{
p.style.display="none";
});

/* Show selected page */

const page = document.getElementById(pageId);

if(page){
page.style.display="block";
}

/* SAFE MODULE LOADING */

if(pageId === "staffPage"){
if(typeof loadStaff === "function"){
loadStaff();
}
}

if(pageId === "orderPage"){
if(typeof loadOrders === "function"){
loadOrders();
}

if(typeof loadRoleOrders === "function"){
loadRoleOrders();
}
}

if(pageId === "restaurant"){
if(typeof loadFoods === "function"){
loadFoods();
}
}

if(pageId === "drinks"){
if(typeof loadDrinks === "function"){
loadDrinks();
}
}

}catch(error){
console.log("Page load error:",error);
}

};



/* ===============================
DASHBOARD STATS
=============================== */

async function loadDashboardStats(){

try{

const roomsSnap = await getDocs(collection(db,"rooms"));

let totalRooms = roomsSnap.size;
let occupiedRooms = 0;

roomsSnap.forEach(r=>{
if(r.data().status === "Occupied"){
occupiedRooms++;
}
});

const foodSnap = await getDocs(collection(db,"foods"));
const drinkSnap = await getDocs(collection(db,"drinks"));

let totalFoods = foodSnap.size;
let totalDrinks = drinkSnap.size;

/* Update UI */

if(document.getElementById("totalRooms")){
document.getElementById("totalRooms").innerText = totalRooms;
}

if(document.getElementById("occupiedRooms")){
document.getElementById("occupiedRooms").innerText = occupiedRooms;
}

if(document.getElementById("totalFoods")){
document.getElementById("totalFoods").innerText = totalFoods;
}

if(document.getElementById("totalDrinks")){
document.getElementById("totalDrinks").innerText = totalDrinks;
}

}catch(err){
console.log(err);
}

}


/* ===============================
LOGOUT
=============================== */

window.logout = function(){

if(confirm("Logout?")){

auth.signOut().then(()=>{
window.location="index.html";
});

}

};


/* ===============================
AUTO LOAD DASHBOARD
=============================== */

loadDashboardStats();
