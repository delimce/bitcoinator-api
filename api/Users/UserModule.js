'use strict'
const conf = require("./config.json");
const models = require("../../models");
const Boom = require('boom');
const Joi = require('joi');
const bcrypt = require('bcrypt');
let _ = require("lodash");
let locale = require("../../libs/i18nHelper");
let email = require("../../libs/EmailHelper");
let utils = require("../../libs/UtilsHelper");
let config = require("../../config/settings.json");
let requestify = require('requestify'); ///resource for execute vendor services

const Op = require('sequelize').Op; ///operators for sequelize

const userModule = {
    register: async (server, options) => {
        // add functionality -> we’ll do that in the section below

        server.route([
            {
                method: 'GET',
                path: conf.basePath,
                config: { auth: conf.auth },
                handler: async (request, h) => {
                    try {
                        let result = await models.User.findAll()
                        return result
                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            },
            {
                method: 'POST',
                path: conf.basePath + "/new",
                config: {
                    auth: conf.auth
                },
                handler: async (request, h) => {

                    var data = request.payload   // <-- this is the important line
                    let ip = request.headers['x-forwarded-for'] || request.info.remoteAddress;
                    try {
                        // find in database
                        let result = await models.User.findOne({
                            attributes: ['id'],
                            where: { email: { [Op.eq]: data.email } }
                        })

                        if (_.isNull(result)) { ///doesn't exist

                            try {


                                let params = await String("secret=" + config.recaptcha + "&" + "response=" + data.recaptcha + "&" + "remoteip=" + ip)
                                let googleRecap = await requestify.get('https://www.google.com/recaptcha/api/siteverify?' + params, null)
                                let recaptchaResponse = googleRecap.getBody()
                                console.log(recaptchaResponse)
                                if (recaptchaResponse.success) {

                                    // you can also build, save and access the object with chaining:
                                    let newUser = await models.User.build({ name: data.name, lastname: data.lastname, email: data.email, password: bcrypt.hashSync(data.password, 10) }).save()

                                    let regObject = {}
                                    regObject.id = data2.attributes.id;
                                    regObject.email = data2.attributes.email;
                                    regObject.date = data2.attributes.created_at;
                                    let register_token = utils.jwtEncodeObject(regObject)
                                    return regObject;

                                } else {
                                    return Boom.badRequest(locale.getString("recaptchaError"))
                                }

                            } catch (err) {
                                return Boom.badImplementation('Failed to get....', err)
                            }

                        } else { ///email exists
                            return Boom.badRequest(locale.getString("isRegistered"))
                        }

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }


                }
            },
            {
                method: 'POST',
                path: conf.basePath + "/login",
                config: {
                    auth: conf.auth,
                    validate: {
                        payload: {
                            email: Joi.string().email().required(),
                            password: Joi.string().min(4).max(200).required()
                        }
                    }
                },
                handler: async (request, h) => {

                    try {
                        let data = request.payload;   // <-- this is the important line
                        let result = await models.User.findOne({
                            attributes: ['id', 'email', 'name', 'password', 'status'],
                            where: { email: { [Op.eq]: data.email } }
                        })

                        // success
                        if (!_.isNull(result)) {
                            if (bcrypt.compareSync(data.password, result.dataValues.password)) {
                                // Passwords match
                                if (result.dataValues.status) {

                                    var obj = {}; // object/info you want to sign
                                    obj.userId = result.dataValues.id;
                                    obj.userName = result.dataValues.name;
                                    obj.userEmail = result.dataValues.email;

                                    let token = await utils.jwtEncodeObject(obj); //generating a new JWT
                                    obj.token = token;

                                    return obj;

                                } else {
                                    return Boom.badRequest(locale.getString("inactive"))
                                }

                            } else {
                                // Passwords don't match
                                return Boom.unauthorized(locale.getString("notLogged"));
                            }

                        } else {
                            return Boom.unauthorized(locale.getString("notLogged"));
                        }

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }

            },

            {
                method: 'PUT',
                path: conf.basePath + "/resetPassword",
                config: { auth: false },
                handler: async (request, h) => {

                    try {

                        var data = request.payload   // <-- this is the important line

                        let result = await models.User.findOne({
                            attributes: ['id', 'email', 'name', 'lastname'],
                            where: { email: { [Op.eq]: data.email } }
                        })

                        // success
                        if (_.size(result) > 0) { /// user found
                            let myData = {};
                            myData.userId = result.dataValues.id;
                            myData.email = result.dataValues.email;
                            myData.fullname = result.dataValues.name + " " + result.dataValues.lastname;

                            let myToken = utils.jwtEncodeObject(myData)
                            return myToken;

                        } else {
                            return Boom.badRequest(locale.getString("isNotRegistered"))
                        }

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }
                }
            },

            {
                method: 'PUT',
                path: conf.basePath + "/changePassword",
                config: {
                    auth: 'jwt'
                },
                handler: async (request, h) => {

                    var data = request.payload   // <-- this is the important line
                    try {

                        return request.auth.credentials

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            }
        ])

    },
    name: 'userModule',
    version: '1.0.0',
    once: true,
    options: {}
}

module.exports = userModule