"use strict"

document.addEventListener ("DOMContentLoaded", main );
    
function main(){
    if(parseInt(p)===0 || p===null){
    document.getElementById("btn-previous").disabled = true;
    }
    if(document.getElementById("ultima").value === "True"){
        document.getElementById("btn-next").disabled = true;
    }
    $("#btn-previous").click(previous);
    $("#btn-next").click(next);
}

const p = new URLSearchParams(window.location.search).get('p');
let pag = p;
function previous(){
    if(pag === null){ 
        pag = 0; 
    }else{
        pag = parseInt(pag);
    }
    if (pag>0){ pag -= 1; }
    let url = new URLSearchParams(window.location.search);
    url.set('p', pag);
    window.location.search = url;
}

function next(){
    if(pag === null){ 
        pag = 0; 
    }else{
        pag = parseInt(pag);
    }
    pag += 1;
    let url = new URLSearchParams(window.location.search);
    url.set('p', pag);
    window.location.search = url;
}