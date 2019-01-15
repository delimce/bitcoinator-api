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
                path: conf.basePath + "/sellByCurrency/{cur}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        let data = request.payload;   // <-- this is the important line
                        let resp = await localbtc.getSellByCurrency(request.params.cur)

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
                method: 'get',
                path: conf.basePath + "/buyByCurrency/{cur}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        let resp = await localbtc.getBuyByCurrencyLocation(request.params.cur)
                        return resp

                    } catch (err) {
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