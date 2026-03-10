import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { setLanguage } from "./i18n.js";

const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const languageSelect = document.getElementById("languageSelect");
const errorMsg = document.getElementById("errorMsg");


// language change
languageSelect.addEventListener("change",()=>{

setLanguage(languageSelect.value);

});


// password toggle
togglePassword.addEventListener("click",()=>{

const type = passwordInput.type === "password" ? "text" : "password";
passwordInput.type = type;

togglePassword.textContent = type === "password" ? "👁️" : "🙈";

});


// login
loginBtn.addEventListener("click",async ()=>{

const email = document.getElementById("email").value;
const password = passwordInput.value;

if(!email || !password){

errorMsg.textContent = "Enter email and password";
return;

}

try{

await signInWithEmailAndPassword(auth,email,password);

window.location.href="dashboard.html";

}catch(err){

errorMsg.textContent="Login failed";
console.error(err);

}

});
