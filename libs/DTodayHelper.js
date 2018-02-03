'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");

exports.getToday = async function () {

    let $today = await requestify.get('https://s3.amazonaws.com/dolartoday/data.json');
    return $today.getBody()

}