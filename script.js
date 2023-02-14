var drop = document.getElementById("drop");
var cont = document.getElementById("content");
var curr = document.getElementById("curr");
var ele = document.getElementById("cont");
var left = document.getElementById("topl_id");
var right = document.getElementById("topr_id");
var semanticWeb = document.getElementById("semanticWeb");
var impressions = [];


var MY_TOKEN= "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";



//index of number of pages to cycle thru
var numberOfPages=7;

var path = window.location.pathname;
console.log(path);

var page = path.split("/").pop();

var pagestring = page.split(".")[0];

if(pagestring=="index"){
    pagestring="1";
}

var pagenumber = parseInt(pagestring, 10);

if (!pagenumber) pagenumber = 1;

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
    var logits = OpenaiFetchAPI(impression);
    console.log("impressioninternal:"+logits[0]);
    var x=Math.floor(Math.random() * 101);
    var y=Math.floor(Math.random() * 101);
    impressionh = "<div class=\"semance\" style=\"position: absolute;top:"+x+"%;left: "+y+"%;color:red;\">" + impression + "</div>";
    impressions.push(impressionh);
    console.log(impressions);
    semanticWeb.innerHTML = impressions.toString();
    return false;
}

//https://community.openai.com/t/communicating-with-the-api-in-vanilla-js-no-server-side-stuff/4984/6
async function OpenaiFetchAPI(in1) {
    var impression = document.getElementById("impression1").value;
    console.log("Calling 3mbedding")
    var url = "https://api.openai.com/v1/embeddings"
    var bearer = 'Bearer ' + MY_TOKEN;
    var response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "input": in1,
            "model":"text-embedding-ada-002"
        })
    })
    var datav1  = await response.json();
    console.log(datav1.data[0].embedding)
    return datav1.data[0].embedding;
}

//https://community.openai.com/t/communicating-with-the-api-in-vanilla-js-no-server-side-stuff/4984/6
async function DirectFetch() {
    var impression = document.getElementById("impression1").value;
    console.log("Calling 3mbedding")
    var url = "https://api.openai.com/v1/embeddings"
    var bearer = 'Bearer ' + MY_TOKEN;
    var response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "input": impression,
            "model":"text-embedding-ada-002"
        })
    })
    var datav1  = await response.json();
    console.log(datav1.data[0].embedding)
    var logit= datav1.data[0].embedding;

    var x=Math.floor(Math.random() * logit[0]);
    var y=Math.floor(Math.random() * logit[0]);
    impressionh = "<div class=\"semance\" style=\"position: absolute;top:"+x+"%;left: "+y+"%;color:red;\">" + impression + "</div>";
    impressions.push(impressionh);
    console.log(impressions);
    semanticWeb.innerHTML = impressions.toString();
}