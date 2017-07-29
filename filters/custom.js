const custom_filter = {
    register: function (server, options, next) {
        // add functionality -> we’ll do that in the section below


        server.route([{
            method: ['GET', 'POST'],
            path: '/{p*}',
            config: { auth: false },
            handler: function (request, reply) {
                reply('not found').code(404)
            }
        }
        ]);


        // call next() to signal hapi that your plugin has done the job
        next()
    }
}


custom_filter.register.attributes = {
    name: 'custom',
    version: '1.0.0'
}

module.exports = custom_filter