'use strict'
const conf = require("./config.json");
const Boom = require('boom');
const Joi = require('joi');
const _ = require("lodash");
let $today = require("../../libs/DTodayHelper");

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

                        let dtInfo = $today.getToday()
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
                        let dtInfo = await $today.getToday()
                        let id = await request.params.id
                        let fiat = (String(id).toLowerCase()=="dollar")?dtInfo.USD:dtInfo.EUR
                        return fiat

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