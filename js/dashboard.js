function loadPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    const page = document.getElementById(pageId);
    if(page) page.style.display = "block";
}

// Auto-load Rooms page by default
loadPage('roomsPage');

document.getElementById("todayDate").innerText = new Date().toLocaleDateString();

// Submenu toggle
const dashboardTitle = document.querySelector(".menuTitle");
const dashboardSubmenu = document.getElementById("dashboardSubmenu");

dashboardTitle.addEventListener("click", () => {
    dashboardSubmenu.style.display = dashboardSubmenu.style.display === "block" ? "none" : "block";
});
document.addEventListener("click", e => {
    if(!dashboardTitle.contains(e.target) && !dashboardSubmenu.contains(e.target)){
        dashboardSubmenu.style.display = "none";
    }
});

// Logout
function logout() {
    if(confirm("Do you want to logout?")) alert("Logged out successfully!");
}
