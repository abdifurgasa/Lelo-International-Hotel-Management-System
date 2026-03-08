function loadPage(page){

let pages=document.querySelectorAll(".page");

pages.forEach(function(p){
p.style.display="none";
});

document.getElementById(page).style.display="block";

}

if(page==="staff"){
loadStaff();
}
if(page==="order"){
loadOrders();
}
if(page==="order"){
loadRoleOrders();
}
function loadDashboardStats(){

let rooms = JSON.parse(localStorage.getItem("rooms")) || [];
let foods = JSON.parse(localStorage.getItem("foods")) || [];
let drinks = JSON.parse(localStorage.getItem("drinks")) || [];

let totalRooms = rooms.length;

let occupiedRooms = rooms.filter(r => r.status === "Occupied").length;

document.getElementById("totalRooms").innerText = totalRooms;
document.getElementById("occupiedRooms").innerText = occupiedRooms;
document.getElementById("totalFoods").innerText = foods.length;
document.getElementById("totalDrinks").innerText = drinks.length;

}

loadDashboardStats();
function logout(){

let confirmLogout=confirm("Are you sure you want to logout?");

if(confirmLogout){

window.location="index.html";

}

}
