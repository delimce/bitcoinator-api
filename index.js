'use strict';

const Glue = require('glue');
const Disk = require('catbox-disk');
const myServer = require("./config/server.json").dev; ///parameters for server config

const manifest = {
    server: {
        "host": myServer.host,
        "port": myServer.port,
        "routes": {
            "cors": {
                "origin": [
                    "*"
                ]
            }
        },
        cache: [{
            name: 'diskCache',
            engine: new Disk({
                cachePath: myServer.cachePath,
                cleanEvery: 300000, //5 minutes
                partition: 'cache'
            }),
        }],
    },
    register: {
        plugins: [
            "inert",
            "vision",
            "./api/my_module",
            "./filters/custom",
            require("./filters/jwt_bundle"),
            require("./api/Users/UserModule"),
            require("./api/Crypto/CmCModule"),
            require("./api/Calc/CalcModule"),
            require("./api/Localbtc/LocalbtcModule"),
        ],
        options: {
            once: true
        }
    }
};

const options = {
    relativeTo: __dirname
};


const startServer = async function () {
    try {
        const server = await Glue.compose(manifest, options);

        server.views({
            engines: {
                hbs: require('handlebars')
            },
            relativeTo: __dirname,
            path: 'views',
            layoutPath: 'views/layout',
            layout: 'default',
        });

        await server.start();
        console.log('Server started at: ' + server.info.uri);

        // listen on SIGINT signal and gracefully stop the server
        process.on('SIGINT', function () {
            console.log('stopping hapi server')

            server.stop({ timeout: 10000 }).then(function (err) {
                console.log('hapi server stopped')
                process.exit((err) ? 1 : 0)
            })
        })

    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();