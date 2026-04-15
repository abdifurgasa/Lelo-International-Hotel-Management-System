function addOrder() {
    const item = document.getElementById("orderItem").value;

    if (!item) return alert("Enter order");

    const div = document.createElement("div");
    div.textContent = "Order: " + item;

    document.getElementById("orderList").appendChild(div);
}

window.addOrder = addOrder;
