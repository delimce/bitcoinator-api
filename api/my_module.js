const my_module = {
    register: function (server, options, next) {
        // add functionality -> we’ll do that in the section below

        server.route({
            method: 'GET',
            path: '/test',
            config: { auth: false },
            handler: function (request, reply) {
                reply("testing at: "+request.info.host || request.connection.info.host + ':' + request.connection.info.port);

            }
        })

        // call next() to signal hapi that your plugin has done the job
        next()
    }
}


my_module.register.attributes = {
    name: 'myplugin',
    version: '1.0.0'
}

module.exports = my_module