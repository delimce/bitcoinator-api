'use strict';

var resp = {}
var defaultErrorMessage = "error, service has failed";
let _ = require("lodash");


/**
 * setting content  with a success object struct
 */
exports.setContent = function (result) {

    resp = { "success": true }
    resp.content = result;

}


/**
 * set error message
 */
exports.setError = function (errorMessage) {

    resp = { "success": false }
    resp.message = _.isUndefined(errorMessage)?defaultErrorMessage:errorMessage;

}


/**
 * returns Json of restApi
 */
exports.getJSON = function () {

    return resp;

}



