'use strict';

var resp = {}


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
    resp.message = errorMessage;

}


/**
 * returns Json of restApi
 */
exports.getJSON = function () {

    return resp;

}



