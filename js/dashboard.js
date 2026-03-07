import { auth } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// Login Protection
onAuthStateChanged(auth,(user)=>{
if(!user){
window.location.href="index.html";
}
});


// Logout
document.getElementById("logout").onclick=()=>{

signOut(auth).then(()=>{
window.location.href="index.html";
});

};


// Example Chart
const ctx = document.getElementById("chart");

if(ctx){

new Chart(ctx,{
type:"line",
data:{
labels:["Mon","Tue","Wed","Thu","Fri"],
datasets:[{
label:"Revenue",
data:[200,300,400,350,500]
}]
}
});

}
