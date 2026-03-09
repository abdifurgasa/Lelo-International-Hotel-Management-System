/* =========================
PAGE SWITCHING
========================= */

window.loadPage = function(pageId){

const pages = document.querySelectorAll(".page");

pages.forEach(function(page){
page.style.display = "none";
});

const selectedPage = document.getElementById(pageId);

if(selectedPage){
selectedPage.style.display = "block";
}

};


/* =========================
COLLAPSIBLE DASHBOARD MENU
========================= */

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

const type =
staffPassword.getAttribute("type") === "password"
? "text"
: "password";

staffPassword.setAttribute("type", type);

this.textContent = type === "password" ? "👁️" : "🙈";

});

}


/* =========================
TODAY DATE FOR BANNER
========================= */

const todayDateElement = document.getElementById("todayDate");

if(todayDateElement){

const today = new Date();

todayDateElement.innerText =
today.toLocaleDateString(undefined,{
weekday:"long",
year:"numeric",
month:"long",
day:"numeric"
});

}


/* =========================
LOGOUT
========================= */

window.logout = function(){

localStorage.removeItem("leloUser");

alert("You have logged out successfully.");

window.location.href = "login.html";

};


/* =========================
DEFAULT PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", function(){

loadPage("dashboard");

});
