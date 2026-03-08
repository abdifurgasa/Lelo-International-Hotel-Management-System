let billingList = document.getElementById("billingList");

window.loadBilling = function(){

if(!billingList) return;

billingList.innerHTML = "";

let rooms = JSON.parse(localStorage.getItem("rooms")) || [];
let foods = JSON.parse(localStorage.getItem("foods")) || [];
let drinks = JSON.parse(localStorage.getItem("drinks")) || [];

let total = 0;

/* Rooms Billing */

rooms.forEach(room => {

if(room.status === "Occupied"){

total += Number(room.price);

billingList.innerHTML += `
<tr>
<td>Room ${room.number}</td>
<td>Room Charge</td>
<td>${room.price}</td>
<td>${room.status}</td>
</tr>
`;

}

});

/* Food Billing */

foods.forEach(food => {

total += Number(food.price);

billingList.innerHTML += `
<tr>
<td>${food.name}</td>
<td>Food</td>
<td>${food.price}</td>
<td>Used</td>
</tr>
`;

});

/* Drink Billing */

drinks.forEach(drink => {

total += Number(drink.price);

billingList.innerHTML += `
<tr>
<td>${drink.name}</td>
<td>Drink</td>
<td>${drink.price}</td>
<td>Used</td>
</tr>
`;

});

/* Total Row */

billingList.innerHTML += `
<tr style="font-weight:bold;background:#f4f6fb">
<td colspan="2">TOTAL</td>
<td>${total}</td>
<td></td>
</tr>
`;

};

loadBilling();
