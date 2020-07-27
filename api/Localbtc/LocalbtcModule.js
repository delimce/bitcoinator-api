'use strict'
const conf = require("./config.json");
const Boom = require('boom');
const Joi = require('joi');
const _ = require("lodash");
const localbtc = require("../../libs/LocalbitcoinsHelper");

const localbtcModule = {
    register: async (server, options) => {
        server.route([
            {
                method: 'put',
                path: conf.basePath + "/tradingPosts/currency/{cur}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        let data = request.payload;   // <-- this is the important line
                        let resp = await localbtc.getTradingPostsByCurrency(data.type, request.params.cur, data.page)

                        let final = _.filter(resp.results, function (post) {
                            return post.country == data.location.toUpperCase()
                                && (_.includes(post.bank.toLowerCase(), data.bank.toLowerCase())
                                    || _.includes(post.msg.toLowerCase(), data.bank.toLowerCase()))
                                && (data.amount >= post.min && data.amount <= post.max)
                        });

                        return final

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },
            {
                method: 'put',
                path: conf.basePath + "/tradingPosts/location/{code}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        let data = request.payload;   // <-- this is the important line
                        let country = _.find(conf.countries, function (o) { return o.cod == String(request.params.code) });
                        let resp = await localbtc.getTradingPostsByLocation(data.type, request.params.code, country.name, data.page)

                        let final = _.filter(resp.results, function (post) {
                            return post.currency == data.currency.toUpperCase()
                                && (data.amount >= post.min && data.amount <= post.max)
                        });

                        if (data.bank != undefined && !_.isEmpty(data.bank)) {
                            final = _.filter(final, function (post) {
                                return (_.includes(post.bank.toLowerCase(), data.bank.toLowerCase())
                                    || _.includes(post.msg.toLowerCase(), data.bank.toLowerCase()))
                            });
                        }

                        return final

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },
            {
                method: 'put',
                path: conf.basePath + "/traderPosts/location/{code}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        let data = request.payload;   // <-- this is the important line
                        let country = _.find(conf.countries, function (o) { return o.cod == String(request.params.code) });
                        let resp = await localbtc.getTradingPostsByLocation(data.type, request.params.code, country.name, 0)

                        let final = _.filter(resp.results, function (post) {
                            return post.profile.username.toLowerCase() == data.trader.toLowerCase()
                        });

                        return final

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },
            {
                method: 'get',
                path: conf.basePath + "/countries",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        return conf.countries
                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }
                }
            },
            {
                method: 'get',
                path: conf.basePath + "/trader/{username}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        let resp = await localbtc.getTraderProfile(request.params.username)
                        return resp;
                    } catch (err) {
                        console.log(err)
                        return Boom.badImplementation('Failed to get....', err)
                    }
                }
            }

        ]
        )
    },
    name: 'localbtcModule',
    version: '1.0.0',
    once: true,
    options: {}
}

module.exports = localbtcModule