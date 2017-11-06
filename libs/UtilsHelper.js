'use strict';
let jwt = require("jsonwebtoken");
let _ = require("lodash");


/**
 * jwt sign custom object
 * object: my custom object
 */
exports.jwtEncodeObject = function (obj) {

    let secret = require("../config/jwt.json").secret; ///secret key for jwt
    let token = jwt.sign(obj, secret); //generating a new JWT
    return token

}

/**
 * jwt decode token
 * token: jwt token
 */
exports.jwtDecodeObject = function (token) {

    // invalid token - synchronous
    let decoded = false
    try {
        let secret = require("../config/jwt.json").secret; ///secret key for jwt
        decoded = jwt.verify(token, secret);
    } catch (err) {
        // err
        decoded = false;
    } finally {
        return decoded
    }

}

