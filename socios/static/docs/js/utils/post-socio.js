"use strict";

import {messageRenderer} from "/static/docs/js/renderer/messages.js"
import {socioAPI} from "/static/docs/js/API/sociosAPI.js";

const nSocio = new URLSearchParams(window.location.search).get('nSocio');

function main(){

    let registerForm = document.getElementById ("socioForm") ;

    if(nSocio!==null){
        loadSocio();
        registerForm.onsubmit = handleUpdtSocio;

    }else{

        registerForm.onsubmit = handlePostSocio;
    }
    

}

function handlePostSocio(event){

    document.getElementById("saldo").value = 0;

    event.preventDefault();

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let form = event.target;
    let formData = new FormData(form);
    formData.append("saldo", document.getElementById("saldo").value);
    formData.delete("photo-file");
    socioAPI.postSocio(formData, requestOptions)
        //.then (data => window.location.href = "/totalSocios/")
        .then( data => window.location.href = `/socio?nSocio=${data.numeroSocio}`) 
        .catch (error => messageRenderer.showErrorMessage(error));
}

function handleUpdtSocio(event){

    event.preventDefault();

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let form = event.target;
    let formData = new FormData(form);
    formData.append("saldo", document.getElementById("saldo").value);
    formData.delete("photo-file");
    socioAPI.updtSocio(formData, requestOptions)
        .then( data => window.location.href = `/socio?nSocio=${data.numeroSocio}`) 
        .catch (error => messageRenderer.showErrorMessage(error));
}

function loadSocio () {
    let nSocioInput = document.getElementById ("numeroSocio");
    let nombreInput = document.getElementById ("nombre");
    let apellidosInput = document.getElementById ("apellidos");
    let DNIInput = document.getElementById ("DNI");
    let emailInput = document.getElementById ("email");
    let fotoInput = document.getElementById ("taken-pic-src");
    let saldoInput = document.getElementById("saldo");
    let photoPreview = document.getElementById("photo-preview");
    socioAPI.getById (nSocio)
        .then(socio => {
                    let parsedSocio = JSON.parse(socio)[0].fields;
                    nSocioInput.value = parsedSocio.numeroSocio;
                    nSocioInput.disabled = true;
                    nombreInput.value = parsedSocio.nombre;
                    apellidosInput.value = parsedSocio.apellidos;
                    DNIInput.value = parsedSocio.DNI;
                    emailInput.value = parsedSocio.email; 
                    saldoInput.value = parsedSocio.saldo;
                    fotoInput.value = "";
                    photoPreview.src = `/media/${parsedSocio.fotoPerfil}`;
        })
        .catch(error => {messageRenderer.showErrorMessage (error);
        });
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

document.addEventListener ("DOMContentLoaded", main);