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
                method: 'get',
                path: conf.basePath + "/sellByCurrency/{cur}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                         let resp = await localbtc.getSellByCurrency(request.params.cur)
                         return resp

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },
            {
                method: 'get',
                path: conf.basePath + "/buyByCurrency/{cur}/{local}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                         let resp = await localbtc.getBuyByCurrencyLocation(request.params.cur,request.params.local)
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