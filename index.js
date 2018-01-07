'use strict';


const Glue = require('glue');
const myServer = require("./config/server.json"); ///parameters for server config

const manifest = {
    server:myServer.dev,
    register: {
        plugins: [
          "inert",
          "./api/my_module",
          "./filters/custom",
          require("./api/Users/UserModule")
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
        await server.start();
        console.log('Server started at: ' + server.info.uri);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
