let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

const table = document.getElementById("roomTable");


function addRoom(){

let number = document.getElementById("roomNumber").value;
let type = document.getElementById("roomType").value;
let price = document.getElementById("roomPrice").value;

let photoInput = document.getElementById("roomPhoto");
let photo = photoInput.files[0];

let reader = new FileReader();

reader.onload = function(){

let room = {

number:number,
type:type,
price:price,
status:"Available",
photo:reader.result

};

rooms.push(room);

localStorage.setItem("rooms",JSON.stringify(rooms));

displayRooms();

};

if(photo){
reader.readAsDataURL(photo);
}

}


function displayRooms(){

table.innerHTML="";

rooms.forEach(function(room){

table.innerHTML += `

<tr>

<td><img src="${room.photo}" width="60"></td>

<td>${room.number}</td>

<td>${room.type}</td>

<td>${room.price}</td>

<td>${room.status}</td>

</tr>

`;

});

}

displayRooms();
