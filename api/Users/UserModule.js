'use strict'
let conf = require("./config.json");
let models = require("../../models");
let resp = require("../../libs/RestHelper")
let bcrypt = require('bcrypt');
let _ = require("underscore");
let locale = require("../../libs/i18nHelper");
let email = require("../../libs/EmailHelper");

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
                config: { auth: conf.auth },
                handler: function (request, reply) {

                    var data = request.payload   // <-- this is the important line
                    // Store hash in your password DB.
                    // you can also build, save and access the object with chaining:
                    models.User
                        .build({ name: data.name, lastname: data.lastname, email: data.email, password: bcrypt.hashSync(data.password, 10) })
                        .save().then(function (data2) {
                            // success
                            resp.setContent(data2);
                            reply(resp.getJSON()).code(201)
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
                config: { auth: conf.auth },
                handler: function (request, reply) {

                    var data = request.payload   // <-- this is the important line
                    models.User.findOne({
                        attributes: ['id', 'email', 'name', 'password'],
                        where: { email: data.email }
                    }).then(function (result) {
                        // success
                        if (_.size(result) > 0) {

                            if (bcrypt.compareSync(data.password, result.dataValues.password)) {
                                // Passwords match

                                let secret = require("../../config/jwt.json").secret; ///secret key for jwt
                                let jwt = require("jsonwebtoken");
                                var obj = {}; // object/info you want to sign
                                obj.userId = result.dataValues.id;
                                obj.userName = result.dataValues.name;
                                obj.userEmail = result.dataValues.email;

                                var token = jwt.sign(obj, secret); //generating a new JWT
                                obj.token = token;

                                resp.setContent(obj);
                                reply(resp.getJSON()).code(200)
                            } else {
                                // Passwords don't match
                                console.log("no logged")
                                resp.setError(locale.getString("notLogged"))
                                reply(resp.getJSON()).code(200)
                            }


                        } else {
                            resp.setError(locale.getString("notLogged"))
                            reply(resp.getJSON()).code(200)
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

                    email.setTo("ldelima@grupo-un.com,delimce@gmail.com");
                    email.setSubject("probando")
                    email.setContentText("esto es una prueba")


                    email.send();

                    var credentials = request.auth.credentials; ///jwt payload
                    reply(credentials);

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