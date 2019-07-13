"use strict";
let jwt = require("jsonwebtoken");
let _ = require("lodash");
const base64Img = require("base64-img");
const fs = require("fs");

/**
 * jwt sign custom object
 * object: my custom object
 */
exports.jwtEncodeObject = function(obj) {
  let secret = require("../config/jwt.json").secret; ///secret key for jwt
  let token = jwt.sign(obj, secret); //generating a new JWT
  return token;
};

/**
 * jwt decode token
 * token: jwt token
 */
exports.jwtDecodeObject = function(token) {
  // invalid token - synchronous
  let decoded = false;
  try {
    let secret = require("../config/jwt.json").secret; ///secret key for jwt
    decoded = jwt.verify(token, secret);
  } catch (err) {
    // err
    decoded = false;
  } finally {
    return decoded;
  }
};

/**
 * @return bool
 */
exports.isInvalid = function(value) {
  return _.isNil(value) || _.isEmpty(value);
};

/**
 * get svg image for crypto coins
 */
exports.getSVGimage = function(image) {
  let path = "./assets/images/svg/" + image + ".svg";
  let svg = false;
  if (fs.existsSync(path)) {
    svg = base64Img.base64Sync(path);
  } else {
    svg = base64Img.base64Sync("./assets/images/svg/auto.svg");
  }
  return svg;
};
