'use strict'
const conf = require("./config.json");
const Boom = require('boom');
const Joi = require('joi');
const _ = require("lodash");
let locale = require("../../libs/i18nHelper");
let email = require("../../libs/EmailHelper");
let utils = require("../../libs/UtilsHelper");
let config = require("../../config/settings.json");
let cmc = require("../../libs/CmcHelper");
let dtoday = require("../../libs/DTodayHelper");

const cmcModule = {
    register: async (server, options) => {
        // add functionality -> we’ll do that in the section below

        server.route([
            {
                method: 'get',
                path: conf.basePath + "/getCoins",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {

                        let coinMarketCap = cmc.getAll()
                        return coinMarketCap

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },

            {
                method: 'get',
                path: conf.basePath + "/getCoins/{id}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {
                        let id = await request.params.id
                        let coinMarketCap = cmc.getById(id)
                        return coinMarketCap

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },

            {
                method: 'get',
                path: conf.basePath + "/myCoins",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {

                        let coins = ['LTC', 'BTC', 'ETH', 'BCH', 'DASH', 'BTG','ZEC']
                        let coinMarketCap = await cmc.findCoins(coins)


                        return h.view('cmc/coins', {
                            coins: coinMarketCap,
                            message: 'Hello Handlebars!'
                        });


                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },

            {
                method: 'get',
                path: conf.basePath + "/mCoins",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {

                        let coinMarketCap = await cmc.findCoins()
                        return coinMarketCap

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },

            {
                method: 'get',
                path: "/rekorbit/maindata",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {

                        let coins = ['LTC', 'BTC', 'ETH', 'BCH', 'DASH', 'BTG','ZEC']

                        let coinMarketCap = await cmc.findCoins(coins)
                        let dolartoday = await dtoday.getToday()
                        let price_gold_gram = await dtoday.goldPriceGram(dolartoday.GOLD.rate)

                        let currency = []

                        ////cmc data
                        _.forEach(coinMarketCap, function (coin) {

                                let newCoin = {}
                                newCoin.id = coin.id;
                                newCoin.symbol = coin.symbol;
                                newCoin.type = "crypto",
                                newCoin.price_btc = coin.price_btc;
                                newCoin.price_usd = coin.price_usd;
                                newCoin.percent4rent =coin.percent4rent;
                                newCoin.profit = coin.profit;

                            currency.push(newCoin)

                        });


                        ///dolartoday data
                        let dollar ={
                            "id":"dollar",
                            "symbol":"USD",
                            "type":"fiat",
                            "price_bs":Number(dolartoday.USD.dolartoday),
                            "price_usd":1
                        }

                        currency.push(dollar)

                        let euro ={
                            "id":"euro",
                            "symbol":"EUR",
                            "type":"fiat",
                            "price_bs":Number(dolartoday.EUR.dolartoday),
                            "price_usd":Number(dolartoday.EURUSD.rate)
                           
                        }

                        currency.push(euro)

                        let gold ={
                            "id":"gold",
                            "symbol":"GOLD",
                            "type":"commodity",
                            "price_bs":Number(dolartoday.USD.dolartoday*price_gold_gram),
                            "price_usd":Number(price_gold_gram)
                        }

                        currency.push(gold)

                        return currency

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            }


        ])

    },
    name: 'cmcModule',
    version: '1.0.0',
    once: true,
    options: {}
}

module.exports = cmcModule