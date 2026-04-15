import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};
