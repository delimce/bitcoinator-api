"use strict";

let _ = require("lodash");
const rp = require('request-promise');

require("dotenv").config();
let apiKey = process.env.CMC_API_KEY;
let urlPath = "https://pro-api.coinmarketcap.com/v1/";

exports.getAll = async function () {
    let coinMarketCap = await rp({
        method: 'GET',
        uri: urlPath + "cryptocurrency/listings/latest",
        qs: {
            start: "1",
            limit: "1000",
            convert: "USD"
        },
        headers: {
            'X-CMC_PRO_API_KEY': apiKey
        },
        json: true,
        gzip: true
    })
    return coinMarketCap.data;
};


exports.getById = async function (id) {

    let coinMarketCap = await rp({
        method: 'GET',
        uri: urlPath + "cryptocurrency/quotes/latest",
        qs: {
            'slug': id
        },
        headers: {
            'X-CMC_PRO_API_KEY': apiKey
        },
        json: true,
        gzip: true
    })
    return coinMarketCap.data;
};


const parseCoin = function (coin) {
    let newCoin = {};
    newCoin.id = coin.slug;
    newCoin.cmc_id = coin.id;
    newCoin.symbol = coin.symbol;
    let usd_detail = coin.quote.USD;
    newCoin.price_usd = Number(usd_detail.price);
    newCoin.percent_1h = Number(usd_detail.percent_change_1h);
    newCoin.percent_24h = Number(usd_detail.percent_change_24h);
    newCoin.percent_7d = Number(usd_detail.percent_change_7d);
    newCoin.percent4rent = _.round(usd_detail.percent_change_1h + usd_detail.percent_change_24h, 3);
    newCoin.profit = newCoin.percent4rent >= 0 ? true : false;
    return newCoin;
};

exports.shorInfoCoins = function (coinMarketCap) {
    let infoCoins = [];
    _.forEach(coinMarketCap, function (coin) {
        let newCoin = parseCoin(coin);
        infoCoins.push(newCoin);
    });
    return infoCoins;
};

exports.findCoins = async function (coins, coinMarketCap) {
    let newCoins = [];
    _.forEach(coinMarketCap, function (coin) {
        if (_.includes(coins, coin.symbol)) {
            let newCoin = parseCoin(coin);
            newCoins.push(newCoin);
        }
    });

    return _.orderBy(newCoins, ["percent4rent"], ["desc"]);
};
