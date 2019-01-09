'use strict'
const conf = require("./config.json");
const Boom = require('boom');
const Joi = require('joi');
const _ = require("lodash");
let $localbtc = require("../../libs/LocalbitcoinsHelper");

const localbtcModule = {
    register: async (server, options) => {
        server.route([
            {
                method: 'get',
                path: conf.basePath + "/getCoins",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {

                      

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            }
        ])
    },
    name: 'localbtcModule',
    version: '1.0.0',
    once: true,
    options: {}
}

module.exports = localbtcModule