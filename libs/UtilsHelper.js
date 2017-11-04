'use strict';
let secret = require("../config/jwt.json").secret; ///secret key for jwt
let jwt = require("jsonwebtoken");
let _ = require("lodash");