import { auth } from "./firebase.js";
import { 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Login button
const loginBtn = document.getElementById("loginBtn");
const errorText = document.getElementById("error");

loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    errorText.textContent = "";

    if (!email || !password) {
        errorText.textContent = "Please enter email and password";
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            // success → go to dashboard
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            errorText.textContent = error.message;
        });
});
