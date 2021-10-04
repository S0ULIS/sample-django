"use strict";

import {messageRenderer} from "/static/docs/js/renderer/messages.js"
import {sistAPI} from "/static/docs/js/API/sistAPI.js";
import {socioRenderer} from "/static/docs/js/renderer/sociosRenderer.js";

const nSocio = new URLSearchParams(window.location.search).get('nSocio');

function main(){


    let button1 = document.getElementById("accept-donation");
    button1.onclick = handlePostDonacion;
    let button2 = document.getElementById("cancelDonation");
    button2.onclick = cancelDonation;

    
}

function cancelDonation(){
    document.getElementById("donate-form").style.display="none";
    document.getElementById("aportacion").value="";
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

document.addEventListener ("DOMContentLoaded", main);