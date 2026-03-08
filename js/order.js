import { db, auth } from "./firebase.js";

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


window.addOrder = async function(){

const type = document.getElementById("orderType").value;
const item = document.getElementById("orderItem").value;
const price = document.getElementById("orderPrice").value;

const user = auth.currentUser.email;

try{

await addDoc(collection(db,"orders"),{

type:type,
item:item,
price:price,
user:user,
status:"pending",
date:new Date()

});

alert("Order Added");

loadOrders();

}catch(error){

alert(error.message);

}

}


window.loadOrders = async function(){

const orderList = document.getElementById("orderList");
orderList.innerHTML="";

const querySnapshot = await getDocs(collection(db,"orders"));

querySnapshot.forEach(doc=>{

const data = doc.data();

orderList.innerHTML += `

<p>
${data.item} - ${data.price} birr - ${data.type} - ${data.status}
</p>

`;

});

}
