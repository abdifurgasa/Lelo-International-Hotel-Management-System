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
function logout(){

let confirmLogout=confirm("Are you sure you want to logout?");

if(confirmLogout){

window.location="index.html";

}

}
