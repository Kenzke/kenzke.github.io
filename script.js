var drop = document.getElementById("drop");
var cont = document.getElementById("content");
var curr = document.getElementById("curr");
var ele = document.getElementById("cont");
var left = document.getElementById("topl_id");
var right = document.getElementById("topr_id");
var semanticWeb = document.getElementById("semanticWeb");
var impressions = [];

//index of number of pages to cycle thru
var numberOfPages=8;

var path = window.location.pathname;
console.log(path);

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


//page cycler
right.onclick = function(){
    if(pagenumber>=numberOfPages){
        location.href = "index.html";
    }else{
        var pagenumberplusone = pagenumber + 1;
        var fulllocation = pagenumberplusone.toString()+".html"
        location.href = fulllocation;
        console.log(fulllocation + " " + (typeof fulllocation));
    }
}
left.onclick = function(){
    if(pagenumber==1){
        var fulllocation = numberOfPages.toString()+".html";
        location.href = fulllocation;
        console.log(fulllocation + " " + (typeof fulllocation));
    }else if(pagenumber==2){
        location.href = "index.html";
    }else{
        var pagenumberminusone = pagenumber -1;
        var fulllocation = pagenumberminusone.toString() + ".html";
        location.href = fulllocation;
        console.log(fulllocation + " " + (typeof fulllocation));
    }
}

function pushImpression(){
    var impression = document.getElementById("impression1").value;
    impressions.push(impression);
    console.log(impressions);
    semanticWeb.innerHTML = impressions.toString();
    return false;
}
