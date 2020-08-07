'use strict'
const conf = require("./config.json");
const Boom = require('boom');
const Joi = require('joi');
const cronista = require("../../libs/CronistaHelper");
const floatrates = require("../../libs/FloatratesHelper");
const _ = require("lodash");

const calcModule = {

    register: async (server, options) => {

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
                path: conf.basePath + "/floatrates",
                config: {
                    auth: false
                },
                handler: async (request, h) => {

                    try {
                        let info = await server.methods.floatrates()
                        return info
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
                    auth: false,
                },
                handler: async (request, h) => {
                    try {
                        let argUsd = await cronista.getInfoArg()
                        let argPricesList = _.map(await cronista.getArsCurrencies(argUsd), function (item) {
                            let temp = {};
                            temp.id = String(item.Id);
                            temp.name = item.Nombre;
                            temp.symbol = 'ARG';
                            temp.precent = item.VariacionPorcentual;
                            temp.price_sell = item.Venta;
                            temp.price_buy = item.Compra;
                            return temp;
                        })
                        return argPricesList

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