const custom_filter = {
    register: async (server, options) => {
        // Do your registration stuff

        server.route({
            method: ['GET', 'POST'],
            path: '/{p*}',
            config: { auth: false },
            handler: function (request, h) {
                let Boom = require('boom')
                return Boom.notFound('resource not found')
            }
        })

    },
    name: 'custom',
    version: '1.0.0',
    once: true,
    options: {}
};

module.exports = custom_filter;