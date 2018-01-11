'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");




exports.getAll = async function () {
    
    let coinMarketCap = await requestify.get('https://api.coinmarketcap.com/v1/ticker/');
    return coinMarketCap.getBody()

}


exports.getById = async function (coin) {

    let endPoint =  `https://api.coinmarketcap.com/v1/ticker/${coin}/`
    console.log(endPoint)
    let coinMarketCap = await requestify.get(endPoint);
   
    return coinMarketCap.getBody()

}