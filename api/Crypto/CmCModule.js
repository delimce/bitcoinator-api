'use strict'
const conf = require("./config.json");
const models = require("../../models");
const Boom = require('boom');
const Joi = require('joi');
let _ = require("lodash");
let locale = require("../../libs/i18nHelper");
let email = require("../../libs/EmailHelper");
let utils = require("../../libs/UtilsHelper");
let config = require("../../config/settings.json");
let requestify = require('requestify'); ///resource for execute vendor services

const cmcModule = {
    register: async (server, options) => {
        // add functionality -> we’ll do that in the section below

       

        server.route([
            {
                method: 'get',
                path: conf.basePath + "/getAll",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {

                        let coinMarketCap = await requestify.get('https://api.coinmarketcap.com/v1/ticker/');
                        return coinMarketCap.getBody()

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