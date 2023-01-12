var drop = document.getElementById("drop");
var cont = document.getElementById("content");
var curr = document.getElementById("curr");
var ele = document.getElementById("cont");
var topl = document.getElementById("topl");
var topr = document.getElementById("topr");


ele.onclick = function() {
    curr.style.display="block";
    cont.style.display="none";
};

drop.onclick = function() {
    if(cont.style.display=="block"){
        curr.style.display="block"
        cont.style.display="none";
    }else{
        cont.style.display="block";
        curr.style.display="none";
    }
};
