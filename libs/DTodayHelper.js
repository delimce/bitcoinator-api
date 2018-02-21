'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");

exports.getToday = async function () {

    //let url_dtoday = "http://45.32.214.171:8082/calc/dolartoday"
    let url_dtoday = "https://s3.amazonaws.com/dolartoday/data.json"
    let $today = await requestify.get(url_dtoday);
    return $today.getBody()

}