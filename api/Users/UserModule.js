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
                    auth: conf.auth,
                    validate: {
                        payload: {
                            name: Joi.string().regex(/^[a-zA-Z '.-]*$/).required(),
                            lastname: Joi.string().regex(/^[a-zA-Z '.-]*$/).required(),
                            email: Joi.string().email().required(),
                            password: Joi.string().min(4).max(200).required(),
                            //        recaptcha: Joi.string().required()
                        }
                    }
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
                                // you can also build, save and access the object with chaining:
                                let newUser = models.User.build({ name: data.name, lastname: data.lastname, email: data.email, password: bcrypt.hashSync(data.password, 10) }).save()
                                return newUser;

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
                            console.log("dos")
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
                path: conf.basePath + "/changePassord",
                config: {
                    auth: false,
                    validate: {
                        payload: {
                            token: Joi.string().required(),
                            password: Joi.string().min(4).max(200).required()
                        }
                    }
                },
                handler: async (request, h) => {

                    var data = request.payload   // <-- this is the important line
                    try {

                     

                    } catch (err) {
                        return Boom.badImplementation('Failed to get....', err)
                    }

                }
            }


            // {
            //     method: 'POST',
            //     path: conf.basePath + "/new",
            //     config: {
            //         auth: conf.auth,
            //         validate: {
            //             payload: {
            //                 name: Joi.string().regex(/^[a-zA-Z '.-]*$/).required(),
            //                 lastname: Joi.string().regex(/^[a-zA-Z '.-]*$/).required(),
            //                 email: Joi.string().email().required(),
            //                 password: Joi.string().min(4).max(200).required(),
            //                 //        recaptcha: Joi.string().required()
            //             }
            //         }
            //     },
            //     handler: function (request, reply) {

            //         var data = request.payload   // <-- this is the important line
            //         let ip = request.headers['x-forwarded-for'] || request.info.remoteAddress;

            //         // find in database
            //         models.User.findOne({
            //             attributes: ['id'],
            //             where: { email: { [Op.eq]: data.email } }
            //         }).then(function (result) {

            //             if (_.size(result) == 0) { ///doesn't exist

            //                 let params = String("secret=" + config.recaptcha + "&" + "response=" + data.recaptcha + "&" + "remoteip=" + ip)
            //                 requestify.get('https://www.google.com/recaptcha/api/siteverify?' + params, null)
            //                     .then(function (response) {
            //                         // Get the response body
            //                         let recaptchaResponse = response.getBody()
            //                         console.log(recaptchaResponse)
            //                         if (recaptchaResponse.success) {
            //                             // you can also build, save and access the object with chaining:
            //                             models.User.build({ name: data.name, lastname: data.lastname, email: data.email, password: bcrypt.hashSync(data.password, 10) })
            //                                 .save().then(function (data2) {
            //                                     // success


            //                                     let regObject = {}
            //                                     regObject.id = data2.attributes.id;
            //                                     regObject.email = data2.attributes.email;
            //                                     regObject.date = data2.attributes.created_at;
            //                                     let register_token = utils.jwtEncodeObject(regObject)

            //                                     resp.setContent(data2);
            //                                     reply(resp.getJSON()).code(201)


            //                                 }).catch(function (err) {
            //                                     resp.setError();
            //                                     console.log(err)
            //                                     reply(resp.getJSON()).code(500)
            //                                 })
            //                         } else {
            //                             resp.setError(locale.getString("recaptchaError"));
            //                             reply(resp.getJSON()).code(400)
            //                         }
            //                     });

            //             } else { ///email exists
            //                 resp.setError(locale.getString("isRegistered"));
            //                 reply(resp.getJSON()).code(400)

            //             }


            //         }).catch(function (err) {
            //             resp.setError();
            //             console.log(err)
            //             reply(resp.getJSON()).code(500)
            //         })


            //     }
            // },
            // {
            //     method: 'POST',
            //     path: conf.basePath + "/login",
            //     config: {
            //         auth: conf.auth,
            //         validate: {
            //             payload: {
            //                 email: Joi.string().email().required(),
            //                 password: Joi.string().min(4).max(200).required()
            //             }
            //         }

            //     },
            //     handler: function (request, reply) {

            //         var data = request.payload   // <-- this is the important line
            //         models.User.findOne({
            //             attributes: ['id', 'email', 'name', 'password', 'status'],
            //             where: { email: { [Op.eq]: data.email } }
            //         }).then(function (result) {
            //             // success
            //             if (_.size(result) > 0) {

            //                 if (bcrypt.compareSync(data.password, result.dataValues.password)) {
            //                     // Passwords match

            //                     if (result.dataValues.status) {

            //                         var obj = {}; // object/info you want to sign
            //                         obj.userId = result.dataValues.id;
            //                         obj.userName = result.dataValues.name;
            //                         obj.userEmail = result.dataValues.email;

            //                         let token = utils.jwtEncodeObject(obj); //generating a new JWT
            //                         obj.token = token;

            //                         resp.setContent(obj);
            //                         reply(resp.getJSON()).code(200)

            //                     } else {
            //                         resp.setError(locale.getString("inactive"));
            //                         reply(resp.getJSON()).code(400)
            //                     }

            //                 } else {
            //                     // Passwords don't match
            //                     console.log("no logged")
            //                     resp.setError(locale.getString("notLogged"))
            //                     reply(resp.getJSON()).code(401)
            //                 }


            //             } else {
            //                 resp.setError(locale.getString("notLogged"))
            //                 reply(resp.getJSON()).code(401)
            //             }

            //         }).catch(function (err) {
            //             resp.setError();
            //             console.log(err)
            //             reply(resp.getJSON()).code(500)
            //         })

            //     }

            // },

            // {
            //     method: 'GET',
            //     path: conf.basePath + "/info",
            //     config: { auth: 'jwt' },
            //     handler: function (request, reply) {

            //         email.setTo("delimce@gmail.com");
            //         email.setSubject("probando");
            //         email.setContentHtml("algo");

            //         email.send();

            //         var credentials = request.auth.credentials; ///jwt payload
            //         reply(credentials);

            //     }
            // },

            // {
            //     method: 'PUT',
            //     path: conf.basePath + "/resetPassword",
            //     config: { auth: false },
            //     handler: function (request, reply) {

            //         var data = request.payload   // <-- this is the important line

            //         models.User.findOne({
            //             attributes: ['id', 'email', 'name', 'lastname'],
            //             where: { email: { [Op.eq]: data.email } }
            //         }).then(function (result) {
            //             // success
            //             if (_.size(result) > 0) { /// user found
            //                 let myData = {};
            //                 myData.userId = result.dataValues.id;
            //                 myData.email = result.dataValues.email;
            //                 myData.fullname = result.dataValues.name + " " + result.dataValues.lastname;

            //                 let myToken = utils.jwtEncodeObject(myData)

            //                 resp.setContent(myToken);
            //                 reply(resp.getJSON()).code(200);

            //             } else {
            //                 resp.setError(locale.getString("isNotRegistered"))
            //                 reply(resp.getJSON()).code(400)
            //             }

            //         }).catch(function (err) {
            //             resp.setError();
            //             console.log(err)
            //             reply(resp.getJSON()).code(500)
            //         })

            //     }
            // },
            // {
            //     method: 'GET',
            //     path: conf.basePath + "/activated",
            //     config: { auth: false },
            //     handler: function (request, reply) {

            //         let params = request.query
            //         if (params.token) { ///token is received

            //             let my_token = utils.jwtDecodeObject(params.token)
            //             reply(my_token).code(200)

            //         } else {
            //             resp.setError(locale.getString("isNotRegistered"))
            //             reply(resp.getJSON()).code(400)
            //         }


            //     }
            // }

        ])

    },
    name: 'userModule',
    version: '1.0.0',
    once: true,
    options: {}
}

module.exports = userModule