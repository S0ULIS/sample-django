"use strict";

import {messageRenderer} from "/static/docs/js/renderer/messages.js"
import {sistAPI} from "/static/docs/js/API/sistAPI.js";

function main(){


    let registerForm = document.getElementById ("donacionForm") ;
    registerForm.onsubmit = handlePostDonacion;

}

function handlePostDonacion(event){

    event.preventDefault();

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let form = event.target;
    let formData = new FormData(form);
    sistAPI.postDonacion(formData, requestOptions)
        .then(window.location.assign("/donaciones/")) 
        .catch (error => messageRenderer.showErrorMessage(error));
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