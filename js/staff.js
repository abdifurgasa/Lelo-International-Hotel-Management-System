import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


window.addStaff = async function(){

const email = document.getElementById("staffEmail").value;
const password = document.getElementById("staffPassword").value;
const role = document.getElementById("staffRole").value;

try{

const user = await createUserWithEmailAndPassword(auth,email,password);

await addDoc(collection(db,"users"),{
email:email,
role:role
});

alert("Staff Added");

loadStaff();

}catch(error){
alert(error.message);
}

}



window.loadStaff = async function(){

const staffList = document.getElementById("staffList");
staffList.innerHTML="";

const querySnapshot = await getDocs(collection(db,"users"));

querySnapshot.forEach(doc=>{

const data = doc.data();

staffList.innerHTML += `
<p>${data.email} - ${data.role}</p>
`;

});

}
