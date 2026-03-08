import { db, auth } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// Load Role Orders

window.loadRoleOrders = async function(){

const user = auth.currentUser;

if(!user) return;

const email = user.email;


// ===== Food Orders =====

const foodDiv = document.getElementById("foodOrders");
foodDiv.innerHTML = "<h3>Food Orders</h3>";

const foodQuery = query(
collection(db,"orders"),
where("type","==","food")
);

const foodSnapshot = await getDocs(foodQuery);

foodSnapshot.forEach(docSnap=>{

const data = docSnap.data();

foodDiv.innerHTML += `
<p>
🍔 ${data.item} - ${data.price} birr
<br>
Status: ${data.status}

<button onclick="completeOrder('${docSnap.id}')">
Complete
</button>

</p>
`;

});


// ===== Drink Orders =====

const drinkDiv = document.getElementById("drinkOrders");
drinkDiv.innerHTML = "<h3>Drink Orders</h3>";

const drinkQuery = query(
collection(db,"orders"),
where("type","==","drink")
);

const drinkSnapshot = await getDocs(drinkQuery);

drinkSnapshot.forEach(docSnap=>{

const data = docSnap.data();

drinkDiv.innerHTML += `
<p>
🥤 ${data.item} - ${data.price} birr
<br>
Status: ${data.status}

<button onclick="completeOrder('${docSnap.id}')">
Complete
</button>

</p>
`;

});

};


// Complete Order

window.completeOrder = async function(orderId){

await updateDoc(
doc(db,"orders",orderId),
{
status:"completed"
}
);

alert("Order completed");

loadRoleOrders();

};
