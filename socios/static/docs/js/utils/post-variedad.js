"use strict";

import {messageRenderer} from "/static/docs/js/renderer/messages.js"
import {sistAPI} from "/static/docs/js/API/sistAPI.js";
let vId = new URLSearchParams ( window.location.search ).get("id");

function main(){

    let registerForm = document.getElementById("variedadForm") ;

    if(vId!==null){
        loadVariedad();
        registerForm.onsubmit = handleUpdtVariedad;

    }else{

        registerForm.onsubmit = handlePostVariedad;

    }
}

function handlePostVariedad(event){

    event.preventDefault();

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let fotoYerbon = document.getElementById("taken-pic-src");
    fotoYerbon.setAttribute("name", "fotasoYerbon");

    let form = event.target;
    let formData = new FormData(form);
    formData.append("THC", 1);
    formData.append("CBD", 1);
    formData.append("sativa", 1);
    if(document.getElementById("disp").checked === true){
        formData.append("disponible", "true");
    }
    formData.delete("photo-file");
    formData.delete("genetica");
    formData.delete("THCCBD");
    sistAPI.postVariedad(formData, requestOptions)
        .then( data => window.location.href = `/carta?tipo=${data.tipo}`) 
        .catch (error => messageRenderer.showErrorMessage(error));
}

function handleUpdtVariedad(event){

    event.preventDefault();

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let fotoYerbon = document.getElementById("taken-pic-src");
    fotoYerbon.setAttribute("name", "fotasoYerbon");

    let form = event.target;
    let formData = new FormData(form);
    if(document.getElementById("disp").checked === true){
        formData.append("disponible", "true");
    }
    formData.delete("photo-file");
    formData.delete("genetica");
    formData.delete("THCCBD");
    sistAPI.updtVariedad(vId, formData, requestOptions)
        .then( data => window.location.href = `/carta?tipo=${data.tipo}`) 
        //.catch (error => messageRenderer.showErrorMessage(error));
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

function loadVariedad () {
    let tipoInput = document.getElementById ("tipo");
    let nombreInput = document.getElementById ("nombre");
    let aportacionInput = document.getElementById ("aportacion");
    let geneticaInput = document.getElementById ("genetica");
    let THCCBDInput = document.getElementById ("THCCBD");
    let stockInput = document.getElementById ("stock");
    let dispInput = document.getElementById("disp");
    let photoPreview = document.getElementById("photo-preview");
    sistAPI.getVariedadById (vId)
        .then(variedad => {
                    let parsedVariedad = JSON.parse(variedad)[0].fields;
                    tipoInput.value = parsedVariedad.tipo;
                    nombreInput.value = parsedVariedad.nombre;
                    aportacionInput.value = parsedVariedad.aportacion;
                    geneticaInput.value = parsedVariedad.sativa;
                    THCCBDInput.value = parsedVariedad.THC; 
                    stockInput.value = parsedVariedad.stock;
                    dispInput.checked = parsedVariedad.disponible;
                    photoPreview.src = `/media/${parsedVariedad.fotoYerbon}`;
                    //visibilityInput.checked = true ; // Activa la casilla
                    //imagePreview.src = urlInput.value;
        })
        .catch(error => {messageRenderer.showErrorMessage (error);
        });
}

document.addEventListener ("DOMContentLoaded", main);