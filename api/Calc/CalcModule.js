'use strict'
const conf = require("./config.json");
const Boom = require('boom');
const Joi = require('joi');
const _ = require("lodash");

const calcModule = {

    register: async (server, options) => {
        // add functionality -> we’ll do that in the section below

        server.route([

            {
                method: 'get',
                path: conf.basePath + "/dolartoday",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {

                        let dtInfo = await server.methods.dtodayAll()
                        return dtInfo

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },

            {
                method: 'get',
                path: conf.basePath + "/dolartoday/{id}",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        let dtInfo = await server.methods.dtodayAll()
                        let id = await request.params.id
                        let fiat = (String(id).toLowerCase() == "dollar") ? dtInfo.USD : dtInfo.EUR
                        return fiat

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }
                }
            },
            {
                method: 'get',
                path: conf.basePath + "/arsinfo",
                config: {
                    auth: false
                },
                handler: async (request, h) => {
                    try {
                        let argUsd = await server.methods.ars()
                        let dtInfo = await server.methods.dtodayAll()
                        let ars_max = (argUsd.libre > argUsd.blue) ? argUsd.libre : argUsd.blue;
                        let arg = {
                            "id": "arg",
                            "symbol": "ARS",
                            "name": "Arg",
                            "type": "fiat",
                            "price_bs": Number((1 / ars_max) * dtInfo.USD.dolartoday),
                            "price_free": (argUsd.libre)?argUsd.libre:0,
                            "price_blue": (argUsd.blue)?argUsd.blue:0
                        }
                        return arg;

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }
                }
            }

        ])

    },
    name: 'calcModule',
    version: '1.0.0',
    once: true,
    options: {}
}

module.exports = calcModule