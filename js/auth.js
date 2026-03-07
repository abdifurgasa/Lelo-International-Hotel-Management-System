import { auth } from "./firebase.js";

import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// Login Button Event
document.getElementById("loginBtn").addEventListener("click", () => {

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if(email === "" || password === ""){
alert("Enter email and password");
return;
}


// Firebase Login
signInWithEmailAndPassword(auth,email,password)
.then(()=>{

// Redirect to dashboard
window.location.href = "dashboard.html";

})
.catch((error)=>{

alert("Login Failed: " + error.message);

});

});
