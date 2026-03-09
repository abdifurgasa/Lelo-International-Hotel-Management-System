// =========================
// PAGE LOADING
// =========================
function loadPage(pageId) {
    // Hide all pages
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    
    // Show selected page
    const page = document.getElementById(pageId);
    if (page) page.style.display = "block";
}

// =========================
// SUBMENU TOGGLE
// =========================
const dashboardTitle = document.querySelector(".menuTitle");
const dashboardSubmenu = document.getElementById("dashboardSubmenu");

dashboardTitle.addEventListener("click", function(e){
    e.stopPropagation();
    dashboardSubmenu.style.display = dashboardSubmenu.style.display === "block" ? "none" : "block";
});
document.addEventListener("click", function(e){
    if(!dashboardTitle.contains(e.target) && !dashboardSubmenu.contains(e.target)){
        dashboardSubmenu.style.display = "none";
    }
});

// =========================
// LOGOUT FUNCTION
// =========================
function logout() {
    if(confirm("Do you want to logout?")) {
        alert("Logged out successfully!");
        // Replace with your Firebase auth.signOut() if needed
        // auth.signOut().then(() => window.location="index.html");
    }
}

// =========================
// SHOW TODAY'S DATE
// =========================
document.getElementById("todayDate").innerText = new Date().toLocaleDateString();

// =========================
// AUTO LOAD ROOMS PAGE BY DEFAULT
// =========================
loadPage('roomsPage');
