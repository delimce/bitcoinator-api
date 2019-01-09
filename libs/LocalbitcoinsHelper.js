'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");

exports.getAll = async function () {

    let coinMarketCap = await requestify.get('https://api.coinmarketcap.com/v1/ticker/');
    return coinMarketCap.getBody()

}