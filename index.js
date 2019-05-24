'use strict';

const Glue = require('glue');
const Disk = require('catbox-disk');
require('dotenv').config()

const manifest = {
    server: {
        "host": process.env.SERVER_HOST,
        "port": process.env.SERVER_PORT,
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
                cachePath: process.env.SERVER_CACHE,
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
