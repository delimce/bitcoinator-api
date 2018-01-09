
let settings = require("../config/settings.json");
let utils = require("../libs/UtilsHelper");
const Boom = require('boom');
const jwt_bundle = {
    register: async (server, options) => {
        // add functionality -> we’ll do that in the section below
        const jwtConfig = require("../config/jwt.json");

        const scheme = function (server, options) {

            return {
                api: {
                    settings: {
                        x: 5
                    }
                },
                authenticate: function (request, h) {

                    const authorization = request.headers.authorization;
                    if (!authorization) {
                        throw Boom.unauthorized(null, 'Custom');
                    }

                    let credentials = utils.jwtDecodeObject(authorization);
                    let data = { "credentials": credentials }

                    return (!credentials) ? Boom.unauthorized(null, 'Custom') : h.authenticated(data);
                }
            };
        };

        server.auth.scheme('custom', scheme);
        server.auth.strategy('jwt', 'custom');
        server.auth.default('jwt');


    },
    name: 'jwt_bundle',
    version: '1.0.0',
    once: true,
    options: {}
}

module.exports = jwt_bundle;