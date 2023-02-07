var drop = document.getElementById("drop");
var cont = document.getElementById("content");
var curr = document.getElementById("curr");
var ele = document.getElementById("cont");
var left = document.getElementById("topl_id");
var right = document.getElementById("topr_id");
//index of number of pages to cycle thru
var numberOfPages=8;

var path = window.location.pathname;

var page = path.split("/").pop();

var pagestring = page.split(".")[0];


if(pagestring=="index"){
    pagestring="1";
}

var pagenumber = parseInt(pagestring, 10);

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

right.onclick = function(){
    if(pagenumber>=numberOfPages){
        location.href = "index.html";
    }else{
        var pagenumberplusone = pagenumber + 1;
        location.href = pagenumberplusone+".html";
    }
}
left.onclick = function(){
    if(pagenumber==1){
        window.open(numberOfPages+".html");
    }else{
        var pagenumberminusone = pagenumber -1;
        window.open(pagenumberminusone+".html");
    }
}
