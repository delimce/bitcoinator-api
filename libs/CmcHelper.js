'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");



exports.getAll = async function () {

    let coinMarketCap = await requestify.get('https://api.coinmarketcap.com/v1/ticker/');
    return coinMarketCap.getBody()

}


exports.getById = async function (coin) {

    let endPoint = `https://api.coinmarketcap.com/v1/ticker/${coin}/`
    console.log(endPoint)
    let coinMarketCap = await requestify.get(endPoint);

    return coinMarketCap.getBody()

}

exports.findCoins = async function () {

    let coins = ['LTC', 'BTC', 'ETH', 'BCH', 'DASH','BTG']

    let coinMarketCap = await requestify.get('https://api.coinmarketcap.com/v1/ticker/');

    let newCoins = [];

    _.forEach(coinMarketCap.getBody(), function (coin) {
        if (_.includes(coins, coin.symbol)) {
            let newCoin = {}
            newCoin.id = coin.id;
            newCoin.symbol = coin.symbol;
            newCoin.price_usd = Number(coin.price_usd);
            newCoin.price_btc = Number(coin.price_btc);
            newCoin.percent_1h = Number(coin.percent_change_1h);
            newCoin.percent_24h = Number(coin.percent_change_24h);
            newCoin.percent_7d = Number(coin.percent_change_7d);
            newCoin.percent4rent = _.round(newCoin.percent_1h+newCoin.percent_24h,3);

            newCoins.push(newCoin)
        }
    });


    return _.orderBy(newCoins,['percent4rent'],['desc']);

}