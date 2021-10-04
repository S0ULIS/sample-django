"use strict";

import {parseHTML} from "/static/docs/js/utils/parseHTML.js";

// Aux function to get the div in which to display messages
// It's centralized here so we can change it easily in the case its ID changes

function getErrorsDiv(divId) {
    return document.getElementById(divId);
}

const messageRenderer = {

    showMessageAsAlert: function (divId, message, bootClass) {
        let html = `<div class="alert alert-${bootClass} alert-dismissible col-md-12">
                        <button type="button" class="btn-close" data-dismiss="alert" onclick="$('.alert').hide();"></button>
                        ${message}
                    </div>`;

        let errorsDiv = getErrorsDiv(divId);

        if (errorsDiv === null) {
            console.error('You tried to render the following message, however, a ' +
                `<div id="${msgsDivID}"> could not be found in your view to show it there:`);
            console.error(message);
            return;
        }

        let messageElem = parseHTML(html);
        errorsDiv.appendChild(messageElem);
    },

    showErrorMessage: function (divId, message) {
        this.showMessageAsAlert(divId, message, "danger");
    },

    showWarningMessage: function (divId, message) {
        this.showMessageAsAlert(divId, message, "warning");
    },

    showSuccessMessage: function (divId, message) {
        this.showMessageAsAlert(divId, message, "success");
    },

    showMessageAsAlert: function (message, bootClass) {
        let html = `<div class="alert alert-${bootClass} alert-dismissible col-md-12">
                    <button type="button" class="btn-close" data-dismiss="alert" onclick="$('.alert').hide();"></button>
                        ${message}
                    </div>`;
        let errorsDiv = document.getElementById("errors");
        let messageElem = parseHTML(html);
        errorsDiv.appendChild(messageElem);
    },

    showErrorMessage: function (message) {
        this.showMessageAsAlert(message, "danger");
    },

    showWarningAsAlert: function (message) {
        this.showMessageAsAlert(message, "warning");
    },

    showSuccessAsAlert: function (message) {
        this.showMessageAsAlert(message, "success");
    },
}

export { messageRenderer };