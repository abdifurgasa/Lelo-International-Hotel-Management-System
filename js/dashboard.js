function loadPage(page){

let pages=document.querySelectorAll(".page");

pages.forEach(function(p){

p.style.display="none";

});

document.getElementById(page).style.display="block";

}
