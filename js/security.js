import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { doc, getDoc } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function protectDashboard(){

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="index.html";
return;
}

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

if(!snap.exists()){
alert("User profile missing");
return;
}

const role = snap.data().role;

console.log("Logged user role:", role);

});

}
