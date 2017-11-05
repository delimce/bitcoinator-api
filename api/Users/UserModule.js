'use strict'
const conf = require("./config.json");
const models = require("../../models");
let resp = require("../../libs/RestHelper");
const Joi = require('joi');
let bcrypt = require('bcrypt');
let _ = require("lodash");
let locale = require("../../libs/i18nHelper");
let email = require("../../libs/EmailHelper");
let utils = require("../../libs/UtilsHelper");
let config = require("../../config/settings.json");
let requestify = require('requestify'); ///resource for execute vendor services

const Op = require('sequelize').Op; ///operators for sequelize

const userModule = {
    register: function (server, options, next) {
        // add functionality -> we’ll do that in the section below

        server.route([
            {
                method: 'GET',
                path: conf.basePath,
                config: { auth: conf.auth },
                handler: function (request, reply) {
                    models.User.findAll().then(function (data) {
                        resp.setContent(data);
                        reply(resp.getJSON()).code(200)
                    }).catch(function (err) {
                        resp.setError();
                        console.log(err)
                        reply(resp.getJSON()).code(500)
                    })

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
                handler: function (request, reply) {

                    var data = request.payload   // <-- this is the important line
                    let ip = request.headers['x-forwarded-for'] || request.info.remoteAddress;

                    // find in database
                    models.User.findOne({
                        attributes: ['id'],
                        where: { email: { [Op.eq]: data.email } }
                    }).then(function (result) {

                        if (_.size(result) == 0) { ///doesn't exist

                            let params = String("secret=" + config.recaptcha + "&" + "response=" + data.recaptcha + "&" + "remoteip=" + ip)
                            requestify.get('https://www.google.com/recaptcha/api/siteverify?' + params, null)
                                .then(function (response) {
                                    // Get the response body
                                    let recaptchaResponse = response.getBody()
                                    console.log(recaptchaResponse)
                                    if (recaptchaResponse.success) {
                                        // you can also build, save and access the object with chaining:
                                        models.User.build({ name: data.name, lastname: data.lastname, email: data.email, password: bcrypt.hashSync(data.password, 10) })
                                            .save().then(function (data2) {
                                                // success
                   
                                                
                                                let regObject = {}
                                                regObject.id = data2.attributes.id;
                                                regObject.email = data2.attributes.email;
                                                regObject.date = data2.attributes.created_at;
                                                let register_token = utils.jwtSignObject(regObject)

                                                resp.setContent(data2);
                                                reply(resp.getJSON()).code(201)


                                            }).catch(function (err) {
                                                resp.setError();
                                                console.log(err)
                                                reply(resp.getJSON()).code(500)
                                            })
                                    } else {
                                        resp.setError(locale.getString("recaptchaError"));
                                        reply(resp.getJSON()).code(400)
                                    }
                                });

                        } else { ///email exists
                            resp.setError(locale.getString("isRegistered"));
                            reply(resp.getJSON()).code(400)

                        }


                    }).catch(function (err) {
                        resp.setError();
                        console.log(err)
                        reply(resp.getJSON()).code(500)
                    })


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
                handler: function (request, reply) {

                    var data = request.payload   // <-- this is the important line
                    models.User.findOne({
                        attributes: ['id', 'email', 'name', 'password', 'status'],
                        where: { email: { [Op.eq]: data.email } }
                    }).then(function (result) {
                        // success
                        if (_.size(result) > 0) {

                            if (bcrypt.compareSync(data.password, result.dataValues.password)) {
                                // Passwords match

                                if (result.dataValues.status) {

                                    var obj = {}; // object/info you want to sign
                                    obj.userId = result.dataValues.id;
                                    obj.userName = result.dataValues.name;
                                    obj.userEmail = result.dataValues.email;

                                    let token = utils.jwtSignObject(obj); //generating a new JWT
                                    obj.token = token;

                                    resp.setContent(obj);
                                    reply(resp.getJSON()).code(200)

                                } else {
                                    resp.setError(locale.getString("inactive"));
                                    reply(resp.getJSON()).code(400)
                                }

                            } else {
                                // Passwords don't match
                                console.log("no logged")
                                resp.setError(locale.getString("notLogged"))
                                reply(resp.getJSON()).code(401)
                            }


                        } else {
                            resp.setError(locale.getString("notLogged"))
                            reply(resp.getJSON()).code(401)
                        }

                    }).catch(function (err) {
                        resp.setError();
                        console.log(err)
                        reply(resp.getJSON()).code(500)
                    })

                }

            },

            {
                method: 'GET',
                path: conf.basePath + "/info",
                config: { auth: 'jwt' },
                handler: function (request, reply) {

                    email.setTo("delimce@gmail.com");
                    email.setSubject("probando");
                    email.setContentHtml("algo");
                    email.setContentText("algo");

                    email.SGsend();

                    var credentials = request.auth.credentials; ///jwt payload
                    reply(credentials);

                }
            },

            {
                method: 'PUT',
                path: conf.basePath + "/resetPassword",
                config: { auth: false },
                handler: function (request, reply) {

                    var data = request.payload   // <-- this is the important line

                    models.User.findOne({
                        attributes: ['id', 'email', 'name', 'lastname'],
                        where: { email: { [Op.eq]: data.email } }
                    }).then(function (result) {
                        // success
                        if (_.size(result) > 0) { /// user found

                            resp.setContent(result.dataValues);
                            reply(resp.getJSON()).code(200);

                        } else {
                            resp.setError(locale.getString("isNotRegistered"))
                            reply(resp.getJSON()).code(400)
                        }

                    }).catch(function (err) {
                        resp.setError();
                        console.log(err)
                        reply(resp.getJSON()).code(500)
                    })

                }
            }

        ])

        // call next() to signal hapi that your plugin has done the job
        next()
    }
}

userModule.register.attributes = {
    name: 'UserModule',
    version: '1.0.0'
}

module.exports = userModule