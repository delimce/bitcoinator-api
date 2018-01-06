const myModule = {
    register: async (server, options) => {
        // Do your registration stuff

        server.route({
            method: 'GET',
            path: '/test',
            config: { auth: false },
            handler: function (request, h) {
                let locale = require("../libs/i18nHelper");
                console.log(locale.getString("Welcome"));
                return "testing at: " + request.info.host || request.connection.info.host + ':' + request.connection.info.port;
            }
        })

    },
    name: 'myModule',
    version: '1.0.0',
    once: true,
    options: {}
};

module.exports = myModule;
