async function loadDashboardStats(){

try{

const roomsSnap = await getDocs(collection(db,"rooms"));

let totalRooms = roomsSnap.size;
let occupiedRooms = 0;

roomsSnap.forEach(r=>{
if(r.data().status === "Booked"){
occupiedRooms++;
}
});

document.getElementById("totalRooms").innerText = totalRooms;
document.getElementById("occupiedRooms").innerText = occupiedRooms;


/* =====================
TODAY STATS
===================== */

const billingSnap = await getDocs(collection(db,"billing"));

let todayRevenue = 0;
let todayBookings = 0;
let todayOrders = 0;

const today = new Date().toDateString();

billingSnap.forEach(doc=>{

const bill = doc.data();

if(!bill.date) return;

const billDate = new Date(bill.date).toDateString();

if(billDate === today){

if(bill.itemType === "room"){
todayBookings++;
}

if(bill.itemType === "food" || bill.itemType === "drink"){
todayOrders++;
}

if(bill.status === "Paid"){
todayRevenue += bill.price;
}

}

});

document.getElementById("todayRevenue").innerText = "$" + todayRevenue;
document.getElementById("todayBookings").innerText = todayBookings;
document.getElementById("todayOrders").innerText = todayOrders;

}catch(err){

console.log(err);

}

}
