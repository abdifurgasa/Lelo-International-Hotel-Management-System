export function routeDashboard(role){

switch(role){

case "admin":
window.location.href="dashboard/admin.html";
break;

case "manager":
window.location.href="dashboard/manager.html";
break;

case "reception":
window.location.href="dashboard/reception.html";
break;

case "worker":
window.location.href="dashboard/worker.html";
break;

case "kitchen":
window.location.href="dashboard/kitchen.html";
break;

case "barman":
window.location.href="dashboard/barman.html";
break;

case "finance":
window.location.href="dashboard/finance.html";
break;

}

}
