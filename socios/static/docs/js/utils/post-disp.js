
import {parseHTML} from "/static/docs/js/utils/parseHTML.js";
import {sistAPI} from "/static/docs/js/API/sistAPI.js";
import {socioRenderer} from "/static/docs/js/renderer/sociosRenderer.js";

import {messageRenderer} from "/static/docs/js/renderer/messages.js";
import {socioAPI} from "/static/docs/js/API/sociosAPI.js";

const nSocio = new URLSearchParams(window.location.search).get('nSocio');
let cont = 0;
var total = 0;
var saldo = 0;

document.addEventListener ("DOMContentLoaded", main );

function main(){

    let button1 = document.getElementById("accept-donation");
    button1.onclick = handlePostDonacion;
    let button2 = document.getElementById("cancelDonation");
    button2.onclick = cancelDonation;

    document.getElementById("showCannaForm").onclick = showCannaForm;

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };
    
    /*socioAPI.getById(nSocio)
        .then(socio => {saldo = parseInt(JSON.parse(socio)[0].fields.saldo);
        })
        .catch(error => messageRenderer.showErrorMessage(error));*/


    socioAPI.getHistorial(nSocio, requestOptions)
        .then(history => {
            socioRenderer.userHistory(JSON.parse(history));
        })
        .catch(error => messageRenderer.showErrorMessage(error));

    $("#add1").click(function(){
        var el=$("#disp1")[0];
        var c1=$("#cantidad1")[0];
        var uds=$("#uds1")[0];
        var list=$("#disp-list")[0];
        var price = el.value.split(" ")[el.value.split(" ").length-1];
        var op = document.getElementById(el.value.split(" ")[0]);
        let creds = 0;
        if(uds.value === "g"){
            creds = c1.value*price;
            let html1 = `<li class="list-group-item" id="lis${cont}">
                            <div class="row">
                                <div class="col-md">
                                    ${op.getAttribute("class")}
                                </div>
                                <div class="col">
                                    ${op.getAttribute("name")}
                                </div>
                                <div class="col">
                                    ${c1.value} ${uds.value}
                                </div>
                                <div class="col" id="creds${cont}">
                                    ${creds} creditos
                                </div>
                                <div class="col">
                                    <button type="button" id="trash${cont}" class="btn btn-link" onclick="" style="color: brown;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <p class="strconcat" style="display: none;">${c1.value}/*/${uds.value}/*/${op.getAttribute("id")}{;}</p>
                            </div>
                        </li>`;
            //$('#lis${cont}').remove(); total-=c1.value*price;
            if(document.getElementById("credsCard")===null){
                list.appendChild(parseHTML(html1));
            }else{

                let dispList = document.getElementById("disp-list");
                let nodes = dispList.childNodes.length;
                dispList.insertBefore(parseHTML(html1), dispList.childNodes[nodes-1]);

            }
    
            total += c1.value*price;

        }else{
            creds = c1.value;
            let html1 = `<li class="list-group-item" id="lis${cont}">
                            <div class="row">
                                <div class="col-md">
                                    ${op.getAttribute("class")}
                                </div>
                                <div class="col">
                                    ${op.getAttribute("name")}
                                </div>
                                <div class="col">
                                    ${(c1.value/price).toFixed(2)} g
                                </div>
                                <div class="col" id="creds${cont}">
                                    ${creds} ${uds.value}
                                </div>
                                <div class="col">
                                    <button type="button" id="trash${cont}" class="btn btn-link" onclick="" style="color: brown;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <p class="strconcat" style="display: none;">${c1.value/price}/*/g/*/${op.getAttribute("id")}{;}</p>
                            </div>
                        </li>`;
        
            if(document.getElementById("credsCard")===null){
                list.appendChild(parseHTML(html1));
            }else{

                let dispList = document.getElementById("disp-list");
                let nodes = dispList.childNodes.length;
                dispList.insertBefore(parseHTML(html1), dispList.childNodes[nodes-1]);

            }
            total += parseFloat(c1.value);

        }

        if(document.getElementById("credsCard")===null){

            let html2 = `<li class="list-group-item list-group-item-success" id="credsCard"><div class="row justify-content-between mt-3">
                        <div class="col">
                            <h5 id="creditosTotal">Total: ${total}</h5>
                        </div>
                        <div class="col">
                            <h5 id="saldoRestante">Saldo restante: ${saldo - total}</h5>
                        </div>
                        <div class="col">
                            <button type="button" id="aceptar1" class="btn btn-success mb-2">Aceptar</button>
                        </div>
                    </div></li>`;

            list.appendChild(parseHTML(html2));

            $("#aceptar1").click(function(){
                let str = "";
                let elemList = $('.strconcat');
                for (let p of elemList){
                    str += p.innerHTML;
                }
                postDisp(str);
            });
            if((saldo - total)<0){
                messageRenderer.showErrorMessage("errorsDisps", "no hay suficiente saldo");
                document.getElementById("aceptar1").disabled = true;
            }

        }else{

            document.getElementById("creditosTotal").innerHTML = `Total: ${total}`;
            document.getElementById("saldoRestante").innerHTML = `Saldo restante: ${saldo - total}`;
            if((saldo - total)<0){
                messageRenderer.showErrorMessage("errorsDisps", "no hay suficiente saldo");
                document.getElementById("aceptar1").disabled = true;
            }

        }

        $(`#trash${cont}`).click(function(){
            if((saldo - total)<0){
                document.getElementById("errorsDisps").innerHTML = "";
                document.getElementById("aceptar1").disabled = false;
            }
            let dispList = document.getElementById("disp-list");
            let n = this.id.substring(this.id.length-1);
            let id = 'lis' + n;
            if(dispList.childNodes.length <= 3){
                dispList.innerHTML = "";
                total = 0;
            }else{
                console.log(dispList.childNodes.length);
                document.getElementById(id).remove();
                total -= parseFloat(creds);
                document.getElementById("creditosTotal").innerHTML = `Total: ${total}`;
                document.getElementById("saldoRestante").innerHTML = `Saldo restante: ${saldo - total}`;
            }
        });

        //str = str + `${c1.value}/*/${uds.value}/*/${op.getAttribute("id")}{;}`;
        cont += 1;
        el.value = "";
        c1.value= "";
        uds.value.default;

    });

    $("#add2").click(function(){
        var el=$("#disp2")[0];
        var c1=$("#cantidad2")[0];
        var uds=$("#uds2")[0];
        var list=$("#disp-list")[0];
        var price = el.value.split(" ")[el.value.split(" ").length-1];
        var op = document.getElementById(el.value.split(" ")[0]);
        let creds = 0;
        if(uds.value === "g"){
            creds = c1.value*price;
            let html1 = `<li class="list-group-item" id="lis${cont}">
                            <div class="row">
                                <div class="col-md">
                                    ${op.getAttribute("class")}
                                </div>
                                <div class="col">
                                    ${op.getAttribute("name")}
                                </div>
                                <div class="col">
                                    ${c1.value} ${uds.value}
                                </div>
                                <div class="col" id="creds${cont}">
                                    ${creds} creditos
                                </div>
                                <div class="col">
                                    <button type="button" id="trash${cont}" class="btn btn-link" onclick="" style="color: brown;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <p class="strconcat" style="display: none;">${c1.value}/*/${uds.value}/*/${op.getAttribute("id")}{;}</p>
                            </div>
                        </li>`;
            //$('#lis${cont}').remove(); total-=c1.value*price;
            if(document.getElementById("credsCard")===null){
                list.appendChild(parseHTML(html1));
            }else{

                let dispList = document.getElementById("disp-list");
                let nodes = dispList.childNodes.length;
                dispList.insertBefore(parseHTML(html1), dispList.childNodes[nodes-1]);

            }
    
            total += c1.value*price;

        }else{
            creds = c1.value;
            let html1 = `<li class="list-group-item" id="lis${cont}">
                            <div class="row">
                                <div class="col-md">
                                    ${op.getAttribute("class")}
                                </div>
                                <div class="col">
                                    ${op.getAttribute("name")}
                                </div>
                                <div class="col">
                                    ${(c1.value/price).toFixed(2)} g
                                </div>
                                <div class="col" id="creds${cont}">
                                    ${creds} ${uds.value}
                                </div>
                                <div class="col">
                                    <button type="button" id="trash${cont}" class="btn btn-link" onclick="" style="color: brown;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <p class="strconcat" style="display: none;">${c1.value/price}/*/g/*/${op.getAttribute("id")}{;}</p>
                            </div>
                        </li>`;
        
            if(document.getElementById("credsCard")===null){
                list.appendChild(parseHTML(html1));
            }else{

                let dispList = document.getElementById("disp-list");
                let nodes = dispList.childNodes.length;
                dispList.insertBefore(parseHTML(html1), dispList.childNodes[nodes-1]);

            }
            total += c1.value;

        }

        if(document.getElementById("credsCard")===null){

            let html2 = `<li class="list-group-item list-group-item-success" id="credsCard"><div class="row justify-content-between mt-3">
                        <div class="col">
                            <h5 id="creditosTotal">Total: ${total}</h5>
                        </div>
                        <div class="col">
                            <h5 id="saldoRestante">Saldo restante: ${saldo - total}</h5>
                        </div>
                        <div class="col">
                            <button type="button" id="aceptar1" class="btn btn-success mb-2">Aceptar</button>
                        </div>
                    </div></li>`;

            list.appendChild(parseHTML(html2));

            $("#aceptar1").click(function(){
                let str = "";
                let elemList = $('.strconcat');
                for (let p of elemList){
                    str += p.innerHTML;
                }
                postDisp(str);
            });
            if((saldo - total)<0){
                messageRenderer.showErrorMessage("errorsDisps", "no hay suficiente saldo");
                document.getElementById("aceptar1").disabled = true;
            }

        }else{

            document.getElementById("creditosTotal").innerHTML = `Total: ${total}`;
            document.getElementById("saldoRestante").innerHTML = `Saldo restante: ${saldo - total}`;
            if((saldo - total)<0){
                messageRenderer.showErrorMessage("errorsDisps", "no hay suficiente saldo");
                document.getElementById("aceptar1").disabled = true;
            }

        }

        $(`#trash${cont}`).click(function(){
            if((saldo - total)<0){
                document.getElementById("errorsDisps").innerHTML = "";
                document.getElementById("aceptar1").disabled = false;
            }
            let dispList = document.getElementById("disp-list");
            let n = this.id.substring(this.id.length-1);
            let id = 'lis' + n;
            if(dispList.childNodes.length <= 3){
                dispList.innerHTML = "";
                total = 0;
            }else{
                console.log(dispList.childNodes.length);
                document.getElementById(id).remove();
                total -= parseInt(creds);
                document.getElementById("creditosTotal").innerHTML = `Total: ${total}`;
                document.getElementById("saldoRestante").innerHTML = `Saldo restante: ${saldo - total}`;
            }
        });

        //str = str + `${c1.value}/*/${uds.value}/*/${op.getAttribute("id")}{;}`;
        cont += 1;
        el.value = "";
        c1.value= "";
        uds.value.default;

    });

    $("#add3").click(function(){
        var el=$("#disp3")[0];
        var c1=$("#cantidad3")[0];
        var uds=$("#uds3")[0];
        var list=$("#disp-list")[0];
        var price = el.value.split(" ")[el.value.split(" ").length-1];
        var op = document.getElementById(el.value.split(" ")[0]);
        let creds = 0;
        if(uds.value === "g"){
            creds = c1.value*price;
            let html1 = `<li class="list-group-item" id="lis${cont}">
                            <div class="row">
                                <div class="col-md">
                                    ${op.getAttribute("class")}
                                </div>
                                <div class="col">
                                    ${op.getAttribute("name")}
                                </div>
                                <div class="col">
                                    ${c1.value} ${uds.value}
                                </div>
                                <div class="col" id="creds${cont}">
                                    ${creds} creditos
                                </div>
                                <div class="col">
                                    <button type="button" id="trash${cont}" class="btn btn-link" onclick="" style="color: brown;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <p class="strconcat" style="display: none;">${c1.value}/*/${uds.value}/*/${op.getAttribute("id")}{;}</p>
                            </div>
                        </li>`;
            //$('#lis${cont}').remove(); total-=c1.value*price;
            if(document.getElementById("credsCard")===null){
                list.appendChild(parseHTML(html1));
            }else{

                let dispList = document.getElementById("disp-list");
                let nodes = dispList.childNodes.length;
                dispList.insertBefore(parseHTML(html1), dispList.childNodes[nodes-1]);

            }
    
            total += c1.value*price;

        }else{
            creds = c1.value;
            let html1 = `<li class="list-group-item" id="lis${cont}">
                            <div class="row">
                                <div class="col-md">
                                    ${op.getAttribute("class")}
                                </div>
                                <div class="col">
                                    ${op.getAttribute("name")}
                                </div>
                                <div class="col">
                                    ${(c1.value/price).toFixed(2)} g
                                </div>
                                <div class="col" id="creds${cont}">
                                    ${creds} ${uds.value}
                                </div>
                                <div class="col">
                                    <button type="button" id="trash${cont}" class="btn btn-link" onclick="" style="color: brown;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                                </div>
                                <p class="strconcat" style="display: none;">${c1.value/price}/*/g/*/${op.getAttribute("id")}{;}</p>
                            </div>
                        </li>`;
        
            if(document.getElementById("credsCard")===null){
                list.appendChild(parseHTML(html1));
            }else{

                let dispList = document.getElementById("disp-list");
                let nodes = dispList.childNodes.length;
                dispList.insertBefore(parseHTML(html1), dispList.childNodes[nodes-1]);

            }
            total += c1.value;

        }

        if(document.getElementById("credsCard")===null){

            let html2 = `<li class="list-group-item list-group-item-success" id="credsCard"><div class="row justify-content-between mt-3">
                        <div class="col">
                            <h5 id="creditosTotal">Total: ${total}</h5>
                        </div>
                        <div class="col">
                            <h5 id="saldoRestante">Saldo restante: ${saldo - total}</h5>
                        </div>
                        <div class="col">
                            <button type="button" id="aceptar1" class="btn btn-success mb-2">Aceptar</button>
                        </div>
                    </div></li>`;

            list.appendChild(parseHTML(html2));

            $("#aceptar1").click(function(){
                let str = "";
                let elemList = $('.strconcat');
                for (let p of elemList){
                    str += p.innerHTML;
                }
                postDisp(str);

            });
            if((saldo - total)<0){
                messageRenderer.showErrorMessage("errorsDisps", "no hay suficiente saldo");
                document.getElementById("aceptar1").disabled = true;
            }

        }else{

            document.getElementById("creditosTotal").innerHTML = `Total: ${total}`;
            document.getElementById("saldoRestante").innerHTML = `Saldo restante: ${saldo - total}`;
            if((saldo - total)<0){
                messageRenderer.showErrorMessage("errorsDisps", "no hay suficiente saldo");
                document.getElementById("aceptar1").disabled = true;
            }

        }

        $(`#trash${cont}`).click(function(){
            if((saldo - total)<0){
                document.getElementById("errorsDisps").innerHTML = "";
                document.getElementById("aceptar1").disabled = false;
            }
            let dispList = document.getElementById("disp-list");
            let n = this.id.substring(this.id.length-1);
            let id = 'lis' + n;
            if(dispList.childNodes.length <= 3){
                dispList.innerHTML = "";
                total = 0;
            }else{
                console.log(dispList.childNodes.length);
                document.getElementById(id).remove();
                total -= parseInt(creds);
                document.getElementById("creditosTotal").innerHTML = `Total: ${total}`;
                document.getElementById("saldoRestante").innerHTML = `Saldo restante: ${saldo - total}`;
            }
        });

        //str = str + `${c1.value}/*/${uds.value}/*/${op.getAttribute("id")}{;}`;
        cont += 1;
        el.value = "";
        c1.value= "";
        uds.value.default;

    });
}

function cancelDonation(){
    document.getElementById("donate-form").style.display="none";
    document.getElementById("aportacion").value="";
}

function showCannaForm(){

    socioAPI.getById(nSocio)
        .then(socio => {saldo = parseInt(JSON.parse(socio)[0].fields.saldo);
        })
        .catch(error => messageRenderer.showErrorMessage(error));
    total = 0;
    document.getElementById("cannadisp-form").style.display="block";
}


function postDisp(str){

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let formData = new FormData();
    formData.append("numeroSocio", nSocio);
    formData.append("dispensaciones", str);
    sistAPI.postDispensacion(formData, requestOptions)
        .then(socio => {
            socio.fotoPerfil = socio.fotoPerfil.replace("/media/","")
            socio.numeroSocio = nSocio;
            socioRenderer.userDetails(socio);
            socioAPI.getHistorial(nSocio, requestOptions)
                .then(history => {
                    socioRenderer.userHistory(JSON.parse(history));
                })
                .catch(error => messageRenderer.showErrorMessage(error));
            socioAPI.getById(nSocio)
            .then(socio => {
                console.log(JSON.parse(socio)[0].fields);
                socioRenderer.preUserDetails(JSON.parse(socio)[0].fields);
                socioRenderer.userDetails(JSON.parse(socio)[0].fields);
                saldo = parseInt(JSON.parse(socio)[0].fields.saldo);
            })
            .catch(error => messageRenderer.showErrorMessage(error));
            
        });

    let userDetailsCard = document.getElementById("userDetailsCard");

    let preUserCard = document.getElementById("preUserCard");

    let dispList = document.getElementById("disp-list");

    userDetailsCard.innerHTML = "";

    preUserCard.innerHTML = "";

    dispList.innerHTML = "";

    total = 0;
}

function handlePostDonacion(event){


    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };
    
    let form = document.getElementById("donateForm");
    let formData = new FormData(form);
    formData.append("numeroSocio", nSocio);
    sistAPI.postDonacion(formData, requestOptions)
        .then(socio => {
            socio.fotoPerfil = socio.fotoPerfil.replace("/media/","")
            socio.numeroSocio = nSocio;
            socioRenderer.userDetails(socio);
            saldo = socio.saldo;
            document.getElementById("donate-form").style.display="none";
            document.getElementById("aportacion").value="";
        })
        .catch(error => console.log(error))
        //.catch(error => messageRenderer.showErrorMessage(error.error));

}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




document.addEventListener ("DOMContentLoaded", main );