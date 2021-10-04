"use strict"

import {parseHTML} from "/static/docs/js/utils/parseHTML.js";
import {messageRenderer} from "/static/docs/js/renderer/messages.js"
import {socioAPI} from "/static/docs/js/API/sociosAPI.js";

const nSocio = new URLSearchParams(window.location.search).get('nSocio');

const socioRenderer = {

    preUserDetails: function (user){

        let preUserCard = document.getElementById("preUserCard");

        if(user.estado==="Renovado"){
            let html = `<div class="col-5">
                            <div class="row row-cols-auto">
                                <h3 class="card-title text-white" id="name">${user.numeroSocio} ${user.nombre} ${user.apellidos}</h3>
                                <button type="button" class="btn btn-outline-light" id="+infobtn" onclick="showUserCard()">+info</button>
                            </div>
                        </div>`;
            let html1 = `<div class="col-1" id="state"></div>`;
            preUserCard.appendChild(parseHTML(html));
            preUserCard.appendChild(parseHTML(html1));

        }else if(user.estado==="No Renovado"){
            let html = `<div class="col-5"><!--col-auto me-auto-->
                            <div class="row row-cols-auto"><!--row-cols-auto-->
                                <h3 class="card-title text-white" id="name">${user.numeroSocio} ${user.nombre} ${user.apellidos}</h3>
                                <button type="button" class="btn btn-outline-light" id="+infobtn" onclick="showUserCard()">+info</button>
                            </div>
                        </div>`
            let html1 =`<div class="col-1" id="state">
                            <i class="fa fa-circle fa-3x" style="float: right; color: #d9534f;" aria-hidden="true"></i>
                        </div>`;
        preUserCard.appendChild(parseHTML(html));
        preUserCard.appendChild(parseHTML(html1));

        }else if(user.estado==="Avisado"){
            let html = `<div class="col-5"><!--col-auto me-auto-->
                            <div class="row row-cols-auto"><!--row-cols-auto-->
                                <h3 class="card-title text-white" id="name">${user.numeroSocio} ${user.nombre} ${user.apellidos}</h3>
                                <button type="button" class="btn btn-outline-light" id="+infobtn" onclick="showUserCard()">+info</button>
                            </div>
                        </div>`
            let html1 =`<div class="col-1" id="state">
                            <i class="fa fa-circle fa-3x" style="float: right; color: #f0ad4e;" aria-hidden="true"></i>
                        </div>`;
        preUserCard.appendChild(parseHTML(html));
        preUserCard.appendChild(parseHTML(html1))

        }else{
            let html = `<div class="col-5"><!--col-auto me-auto-->
                            <div class="row row-cols-auto"><!--row-cols-auto-->
                                <h3 class="card-title text-white" id="name">${user.numeroSocio} ${user.nombre} ${user.apellidos}</h3>
                                <button type="button" class="btn btn-outline-light" id="+infobtn" onclick="showUserCard()">+info</button>
                            </div>
                        </div>`
            let html1 =`<div class="col-1" id="state">
                            <i class="fa fa-circle fa-3x" style="float: right; color: black;" aria-hidden="true"></i>
                        </div>`;
        preUserCard.appendChild(parseHTML(html));
        preUserCard.appendChild(parseHTML(html1));

        }

        return preUserCard;

    },

    userDetails: function(user){

        let userDetailsCard = document.getElementById("userDetailsCard");
        
        userDetailsCard.innerHTML="";

        let html1 = `<div class="col-md-3 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex flex-column align-items-center text-center">
                                    <img class="img-fluid" src="/media/${user.fotoPerfil}">
                                    <div class="mt-3">
                                        <h4>Saldo:</h4>
                                        <div class="card bg-dark text-white"><h4>${user.saldo}</h4></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
        let html2 = `<div class="col-md-8">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Nº socio</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${user.numeroSocio}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Nombre</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${user.nombre}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Apellidos</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${user.apellidos}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">DNI</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${user.DNI}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Email</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        ${user.email}
                                    </div>
                                </div>
                                <hr>
                                <div class="row" id="botones">
                                    <div class="col-sm-4">
                                    <a href="/static/docs/socioForm.html?nSocio=${user.numeroSocio}"><button type="button" class="btn btn-info"><i class="fa fa-pencil" aria-hidden="true"></i></button></a>
                                        <button type="button" class="btn btn-secondary" onclick="showEmail()"><i class="fa fa-envelope-o" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-10" id="email-area" style="display: none;">
                                        <textarea class="form-control" placeholder="escribe un email" id="send-email" rows="3"></textarea>
                                    </div>
                                    <div class="col-sm-2" id="botones2" style="display: none;">
                                        <button type="button" class="btn-close btn-sm" aria-label="Close" onclick="hideEmail()"></button><br>
                                        <button type="button" class="btn btn-secondary btn-sm mt-4"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
        let html3 = `<div class="col-md-1">
                        <button type="button" class="btn-close btn-close-white" onclick="closeUserCard()" aria-label="Close"></button>
                    </div>`;

        userDetailsCard.appendChild(parseHTML(html1));
        userDetailsCard.appendChild(parseHTML(html2));
        userDetailsCard.appendChild(parseHTML(html3));

        return userDetailsCard;

    },
    userHistory: function(history){
        let container = document.getElementById("histUserCard");
        container.innerHTML="";
        let html1 = `
            <li class="list-group-item"><div class="row">
                <div class="col-md-3">
                    <strong>Tipo:</strong>
                </div>
                <div class="col-md-3">
                    <strong>Variedad:</strong>
                </div>
                <div class="col-md-3">
                    <strong>Cantidad:</strong>
                </div>
                <div class="col-md-3">
                    <strong>Fecha:</strong>
                </div>
            </div></li>
        `;
        let html2 = "";
        container.appendChild(parseHTML(html1));
        for (let disp of history){
            html2 = `
            <li class="list-group-item"><div class="row">
                <div class="col-md-3">
                    ${disp.variedad__tipo}
                </div>
                <div class="col-md-3">
                    ${disp.variedad__nombre}
                </div>
                <div class="col-md-3">
                    ${disp.cantidad}
                </div>
                <div class="col-md-3">
                    ${disp.dispensario__fecha}
                </div>
            </div></li>
            `;
            container.appendChild(parseHTML(html2));
        }

    }
};

function main(){
    socioAPI.getById(nSocio)
    .then(socio => {
        socioRenderer.preUserDetails(JSON.parse(socio)[0].fields);
        socioRenderer.userDetails(JSON.parse(socio)[0].fields);
    })
    .catch(error => messageRenderer.showErrorMessage(error));

    
}

export { socioRenderer };
document.addEventListener ("DOMContentLoaded", main );

