'use strict';
let jwt = require("jsonwebtoken");
let _ = require("lodash");


/**
 * jwt sign custom object
 * object: my custom object
 */
exports.jwtSignObject = function (object) {

    let secret = require("../config/jwt.json").secret; ///secret key for jwt
    let token = jwt.sign(obj, secret); //generating a new JWT
    return token

}
