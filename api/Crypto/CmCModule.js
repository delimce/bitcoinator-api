'use strict'
const conf = require("./config.json");
const models = require("../../models");
const Boom = require('boom');
const Joi = require('joi');
const _ = require("lodash");
let locale = require("../../libs/i18nHelper");
let email = require("../../libs/EmailHelper");
let utils = require("../../libs/UtilsHelper");
let config = require("../../config/settings.json");
let cmc = require("../../libs/CmcHelper");

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

                        let coinMarketCap = await cmc.findCoins()

                        return coinMarketCap

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