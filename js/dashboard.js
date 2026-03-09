/* =========================
PAGE SWITCH SYSTEM
========================= */

window.loadPage = function(pageId){

const pages = document.querySelectorAll(".page");

pages.forEach(function(page){
page.style.display = "none";
});

const page = document.getElementById(pageId);

if(page){
page.style.display = "block";
}

};


/* =========================
DASHBOARD MENU TOGGLE
========================= */

document.addEventListener("DOMContentLoaded", function(){

const dashboardToggle = document.getElementById("dashboardToggle");
const dashboardMenu = document.getElementById("dashboardMenu");

if(dashboardToggle){

dashboardToggle.addEventListener("click", function(){

if(dashboardMenu.style.display === "block"){

dashboardMenu.style.display = "none";

}else{

dashboardMenu.style.display = "block";

}

});

}


/* =========================
STAFF PASSWORD TOGGLE
========================= */

const toggleStaffPassword = document.getElementById("toggleStaffPassword");
const staffPassword = document.getElementById("staffPassword");

if(toggleStaffPassword){

toggleStaffPassword.addEventListener("click", function(){

const type = staffPassword.type === "password" ? "text" : "password";

staffPassword.type = type;

this.textContent = type === "password" ? "👁️" : "🙈";

});

}


/* =========================
TODAY DATE
========================= */

const todayDate = document.getElementById("todayDate");

if(todayDate){

const today = new Date();

todayDate.innerText =
today.toLocaleDateString(undefined,{
weekday:"long",
year:"numeric",
month:"long",
day:"numeric"
});

}


/* =========================
DEFAULT PAGE
========================= */

loadPage("dashboard");

});


/* =========================
LOGOUT FUNCTION
========================= */

function logout(){

localStorage.clear();

alert("Logout successful");

window.location.href = "login.html";

}

window.logout = logout;
