'use strict';
let config = require("../config/settings.json");

let requestify = require('requestify'); ///resource for execute vendor services

/**
 * google reCatpcha backend service
 * response: The value of 'g-recaptcha-response'.
 * ip: 	The end user's ip address.
 */
exports.reCaptchaVerify = function (response,ip) {

    requestify.post('https://www.google.com/recaptcha/api/siteverify', {
        "secret": config.recaptcha,
        "response": response,
        "remoteip": ip
    }).then(function (response) {
        // Get the response body
        response.getBody();
    });

}