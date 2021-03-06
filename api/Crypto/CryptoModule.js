"use strict";
const conf = require("./config.json");
const Boom = require("boom");
const Joi = require("joi");
const _ = require("lodash");
let locale = require("../../libs/i18nHelper");
let cmc = require("../../libs/CmcHelper");
let dtoday = require("../../libs/DTodayHelper");
let cronista = require("../../libs/CronistaHelper");
let floatrates = require("../../libs/FloatratesHelper");
let utils = require("../../libs/UtilsHelper");

const cryptoModule = {
  register: async (server, options) => {
    // add functionality -> we’ll do that in the section below

    /**
     * CACHE SERVICE FUNCTIONS FOR CMC ENDPOINTS
     * all functions right here:
     */

    /**
     * CMC all assets
     */

    const assetsAll = function () {
      return cmc.getAll();
    };

    server.method("assetsAll", assetsAll, {
      cache: {
        cache: "diskCache",
        expiresIn: 3 * 60 * 1000,
        segment: "cmc",
        generateTimeout: 3000
      }
    });

    /**
     * CMC asset by id
     */

    const assetDetail = function (id) {
      return cmc.getById(id);
    };

    server.method("assetDetail", assetDetail, {
      cache: {
        cache: "diskCache",
        expiresIn: 3 * 60 * 1000,
        segment: "cmc/detail",
        generateTimeout: 3000
      }
    });

    /**
     * DTODAY values
     */
    const dtodayAll = function () {
      return dtoday.getToday();
    };

    server.method("dtodayAll", dtodayAll, {
      cache: {
        cache: "diskCache",
        expiresIn: 60 * 60 * 1000,
        segment: "dtoday",
        generateTimeout: 2000
      }
    });

    /**
     * ARG peso values
     */

    const ars = function () {
      return cronista.getInfoArg();
    };

    server.method("ars", ars, {
      cache: {
        cache: "diskCache",
        expiresIn: 60 * 60 * 1000,
        segment: "fiat/arg",
        generateTimeout: 3000
      }
    });

    /**
    * FLOATRATES FIAT values
    */

    const floa = function () {
      return floatrates.getInfoFiats();
    };

    server.method("floatrates", floa, {
      cache: {
        cache: "diskCache",
        expiresIn: 60 * 60 * 1000,
        segment: "fiat/floa",
        generateTimeout: 3000
      }
    });


    /**
     * PETRO values
     */

    const petroPrice = function () {
      return petro.getValue()
    };

    server.method("petro", petroPrice, {
      cache: {
        cache: "diskCache",
        expiresIn: 45 * 60 * 1000,
        segment: "petro",
        generateTimeout: 3000
      }
    });



    /**
     * END OF CACHE SERVICES FUNCTIONS
     */

    server.route([

      {
        method: "get",
        path: conf.basePath + "/petro",
        config: {
          auth: false
        },
        handler: async (request, h) => {
          try {
            return server.methods.petro();
          } catch (err) {
            return Boom.badImplementation("Failed to get....", err);
          }
        }
      },

      {
        method: "get",
        path: conf.basePath + "/coins",
        config: {
          auth: false
        },
        handler: async (request, h) => {
          try {
            return server.methods.assetsAll();
          } catch (err) {
            return Boom.badImplementation("Failed to get....", err);
          }
        }
      },

      {
        method: "get",
        path: conf.basePath + "/coins/{id}",
        config: {
          auth: false
        },
        handler: async (request, h) => {
          try {
            let id = await request.params.id;
            let coinMarketCap = await server.methods.assetDetail(id);
            return coinMarketCap;
          } catch (err) {
            return Boom.badImplementation("Failed to get....", err);
          }
        }
      },

      {
        method: "get",
        path: conf.basePath + "/myCoins",
        config: {
          auth: false
        },
        handler: async (request, h) => {
          try {
            let crypto = await server.methods.assetsAll();
            let coins = ["LTC", "BTC", "ETH", "BCH", "DASH", "BTG", "ZEC"];
            let coinMarketCap = await cmc.findCoins(coins, crypto);
            let btcCoin = await _.find(coinMarketCap, function (o) { return o.symbol === "BTC" });

            let currency = [];
            //cmc data
            _.forEach(coinMarketCap, async function (coin) {
              let newCoin = {};
              newCoin.id = coin.id;
              newCoin.symbol = coin.symbol;
              newCoin.price_usd = coin.price_usd;
              newCoin.price_btc = await cmc.getQuantityRelBTC(btcCoin, coin);
              newCoin.percent4rent = coin.percent4rent;
              newCoin.profit = coin.profit;
              newCoin.image = utils.getSVGimage(newCoin.symbol.toLowerCase());

              currency.push(newCoin);
            });

            return h.view("cmc/coins", {
              coins: currency,
              message: "Hello Handlebars!"
            });
          } catch (err) {
            return Boom.badImplementation("Failed to get....", err);
          }
        }
      },

      {
        method: "get",
        path: conf.basePath + "/coins/short",
        config: {
          auth: false
        },
        handler: async (request, h) => {
          try {
            let crypto = await server.methods.assetsAll();
            return cmc.shorInfoCoins(crypto);
          } catch (err) {
            return Boom.badImplementation("Failed to get....", err);
          }
        }
      },

      {
        method: "post",
        path: "/rekorbit/maindata",
        config: {
          auth: false
        },
        handler: async (request, h) => {
          try {
            let coins = request.payload; // <-- crypto coin list

            //async call
            const [coinMarketCap, dolartoday, floatrates] = await Promise.all([
              cmc.findCoins(coins, await server.methods.assetsAll()),
              server.methods.dtodayAll(),
              server.methods.floatrates()
            ]);

            let price_gold_gram = await dtoday.goldPriceGram(
              dolartoday.GOLD.rate
            );

            let btcCoin = await _.find(coinMarketCap, function (o) { return o.symbol === "BTC" });
            let currency = [];
            let floa_euro = await _.find(floatrates, function(o) { return o.code==="EUR"; });
            let floa_ars = await _.find(floatrates, function(o) { return o.code==="ARS"; });
            
            //cmc data
            _.forEach(coinMarketCap, async function (coin) {
              let newCoin = {};
              newCoin.id = coin.id;
              newCoin.cmc_id = coin.cmc_id;
              newCoin.symbol = coin.symbol;
              newCoin.type = "crypto";
              newCoin.price_btc = cmc.getQuantityRelBTC(btcCoin, coin);
              newCoin.price_usd = coin.price_usd;
              newCoin.percent4rent = coin.percent4rent;
              newCoin.profit = coin.profit;
              newCoin.image = utils.getSVGimage(newCoin.symbol.toLowerCase());

              currency.push(newCoin);
            });

            //dolartoday data
            let dollar = {
              id: "dollar",
              symbol: "USD",
              type: "fiat",
              price_bs: Number(dolartoday.USD.dolartoday),
              price_usd: 1
            };

            currency.push(dollar);

            let euro = {
              id: "euro",
              symbol: "EUR",
              type: "fiat",
              price_bs: Number(dolartoday.EUR.dolartoday),
              price_usd:floa_euro.inverseRate
            };

            currency.push(euro);

            let arg = {
              id: "arg",
              symbol: "ARS",
              type: "fiat",
              price_bs: Number(floa_ars.inverseRate * dolartoday.USD.dolartoday),
              price_usd: floa_ars.inverseRate
            };

            currency.push(arg);

            let gold = {
              id: "gold",
              symbol: "GOLD",
              type: "commodity",
              price_bs: Number(dolartoday.USD.dolartoday * price_gold_gram),
              price_usd: Number(price_gold_gram)
            };

            currency.push(gold);
            return currency;

          } catch (err) {
            return Boom.badImplementation("Failed to get....", err);
          }
        }
      }
    ]);
  },
  name: "cmcModule",
  version: "1.0.0",
  once: true,
  options: {}
};

module.exports = cryptoModule;
