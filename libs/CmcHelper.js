"use strict";

let _ = require("lodash");
const rp = require("request-promise");

require("dotenv").config();
let apiKey = process.env.CMC_API_KEY;
let urlPath = "https://pro-api.coinmarketcap.com/v1/";

exports.getAll = async function() {
  let coinMarketCap = await rp({
    method: "GET",
    uri: urlPath + "cryptocurrency/listings/latest",
    qs: {
      start: "1",
      limit: "1000",
      convert: "USD"
    },
    headers: {
      "X-CMC_PRO_API_KEY": apiKey
    },
    json: true,
    gzip: true
  });
  return coinMarketCap.data;
};

exports.getById = async function(id) {
  let coinMarketCap = await rp({
    method: "GET",
    uri: urlPath + "cryptocurrency/quotes/latest",
    qs: {
      slug: id
    },
    headers: {
      "X-CMC_PRO_API_KEY": apiKey
    },
    json: true,
    gzip: true
  });
  return parseCoinDetail(coinMarketCap.data);
};

const parseCoin = function(coin) {
  let newCoin = {};
  newCoin.id = coin.slug;
  newCoin.cmc_id = coin.id;
  newCoin.symbol = coin.symbol;
  let usd_detail = coin.quote.USD;
  newCoin.price_usd = Number(usd_detail.price);
  newCoin.percent_1h = Number(usd_detail.percent_change_1h);
  newCoin.percent_24h = Number(usd_detail.percent_change_24h);
  newCoin.percent_7d = Number(usd_detail.percent_change_7d);
  newCoin.percent4rent = _.round(
    usd_detail.percent_change_1h + usd_detail.percent_change_24h,
    3
  );
  newCoin.profit = newCoin.percent4rent >= 0 ? true : false;
  return newCoin;
};

const parseCoinDetail = function(data) {
  let coin = data["1"];
  return [
    {
      id: coin.slug,
      symbol: coin.symbol,
      name: coin.name,
      rank: coin.cmc_rank,
      price_usd: coin.quote.USD.price,
      price_btc: "1.0",
      "24h_volume_usd": coin.quote.USD.volume_24h,
      market_cap_usd: coin.quote.USD.market_cap,
      available_supply: coin.quote.USD.circulating_supply,
      total_supply: coin.quote.USD.total_supply,
      max_supply: coin.quote.USD.max_supply,
      percent_change_1h: coin.quote.USD.percent_change_1h,
      percent_change_24h: coin.quote.USD.percent_change_24h,
      percent_change_7d: coin.quote.USD.percent_change_7d,
      last_updated: coin.quote.USD.last_updated
    }
  ];
};

exports.shorInfoCoins = function(coinMarketCap) {
  let infoCoins = [];
  _.forEach(coinMarketCap, function(coin) {
    let newCoin = parseCoin(coin);
    infoCoins.push(newCoin);
  });
  return infoCoins;
};

exports.getQuantityRelBTC = async function(btc, altcoin) {
  let finalPrice =
    altcoin.symbol === "BTC"
      ? 1
      : Number(altcoin.price_usd / btc.price_usd).toFixed(8);
  return Number(finalPrice);
};

exports.findCoins = async function(coins, coinMarketCap) {
  let newCoins = [];
  _.forEach(coinMarketCap, function(coin) {
    if (_.includes(coins, coin.symbol)) {
      let newCoin = parseCoin(coin);
      newCoins.push(newCoin);
    }
  });

  return _.orderBy(newCoins, ["percent4rent"], ["desc"]);
};
