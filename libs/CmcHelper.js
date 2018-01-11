'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");




exports.getAll = async function () {

    let coinMarketCap = await requestify.get('https://api.coinmarketcap.com/v1/ticker/');
    return coinMarketCap.getBody()

}

exports.bestProfit = async function (interval) {

    let intervals = [
        { "key": '24h', "value": 'percent_change_24h' },
        { "key": '1h', "value": 'percent_change_1h' },
        { "key": '7d', "value": 'percent_change_7d' }
    ]

    let coinMarketCap = await requestify.get('https://api.coinmarketcap.com/v1/ticker/');
    let best24 = _.orderBy(coinMarketCap.getBody(), _.get(intervals, "key", interval));

}


exports.getById = async function (coin) {

    let endPoint = `https://api.coinmarketcap.com/v1/ticker/${coin}/`
    console.log(endPoint)
    let coinMarketCap = await requestify.get(endPoint);

    return coinMarketCap.getBody()

}