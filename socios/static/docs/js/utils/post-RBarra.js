"use strict"

import {parseHTML} from "/static/docs/js/utils/parseHTML.js";
import {sistAPI} from "/static/docs/js/API/sistAPI.js";
import {messageRenderer} from "/static/docs/js/renderer/messages.js";
import {socioAPI} from "/static/docs/js/API/sociosAPI.js";

let cont = 0;
var total = 0;

document.addEventListener ("DOMContentLoaded", main );

function main(){

    let saldo = 0;

    $("#nSocio").change(function(){
        socioAPI.getById(document.getElementById("nSocio").value)
            .then(socio => {
                saldo = parseInt(JSON.parse(socio)[0].fields.saldo);
                console.log(saldo);
            })
        .catch(error => messageRenderer.showErrorMessage(error));
    })

    $("#add").click(function(){

        var el=$("#consumible")[0];  //used [0] is to get HTML DOM not jquery Object
        var c1=$("#uds")[0];
        var list=$("#disp-list")[0];
        var price = el.value.split(" ")[el.value.split(" ").length-1];
        console.log(price);
        var op = document.getElementById(el.value.split(" ")[0]);
        let creds = 0;

        let html1 = `<li class="list-group-item" id="lis${cont}">
                        <div class="row">
                            <div class="col">
                                ${op.getAttribute("name")}
                            </div>
                            <div class="col">
                                ${uds.value}
                            </div>
                            <div class="col" id="creds${cont}">
                                ${uds.value*price} creditos
                            </div>
                            <div class="col">
                                <button type="button" id="trash${cont}" class="btn btn-link" onclick="" style="color: brown;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                            </div>
                            <p class="strconcat" style="display: none;">${c1.value}/*/${uds.value}/*/${op.getAttribute("id")}{;}</p>
                        </div>
                    </li>`;

        if(document.getElementById("credsCard")===null){
            list.appendChild(parseHTML(html1));
        }else{

            let dispList = document.getElementById("disp-list");
            let nodes = dispList.childNodes.length;
            dispList.insertBefore(parseHTML(html1), dispList.childNodes[nodes-1]);

        }
    
            total += c1.value*price;


        if(document.getElementById("credsCard")===null){

            let html2 = `<li class="list-group-item list-group-item-success" id="credsCard"><div class="row justify-content-between mt-3">
                        <div class="col">
                            <h5 id="creditosTotal">Total: ${total}</h5>
                        </div>
                        <div class="col">
                            <h5 id="saldoRestante">Saldo restante: ${saldo - total}</h5>
                        </div>
                        <div class="col">
                            <button type="button" id="aceptar" class="btn btn-success mb-2">Aceptar</button>
                        </div>
                    </div></li>`;

            list.appendChild(parseHTML(html2));

            $("#aceptar").click(function(){
                let str = "";
                let elemList = $('.strconcat');
                for (let p of elemList){
                    str += p.innerHTML;
                }
                postRbarra(str);
            });
            if((saldo - total)<0){
                messageRenderer.showErrorMessage("no hay suficiente saldo");
                document.getElementById("aceptar").disabled = true;
            }

        }else{

            document.getElementById("creditosTotal").innerHTML = `Total: ${total}`;
            document.getElementById("saldoRestante").innerHTML = `Saldo restante: ${saldo - total}`;
            if((saldo - total)<0){
                messageRenderer.showErrorMessage("no hay suficiente saldo");
                document.getElementById("aceptar").disabled = true;
            }

        }

        $(`#trash${cont}`).click(function(){
            if((saldo - total)<0){
                document.getElementById("errorsDisps").innerHTML = "";
                document.getElementById("aceptar").disabled = false;
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

        cont += 1;

        el.value = "";
        c1.value= "";
        uds.value.default;

    });

}

function postRbarra(str){

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let formData = new FormData();
    formData.append("numeroSocio", document.getElementById("nSocio").value);
    formData.append("dispensaciones", str);
    sistAPI.postBarra(formData, requestOptions)
        .then(window.location.href = "/barra/") 
        .catch (error => messageRenderer.showErrorMessage(error));
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}