'use strict';

const Hapi = require('hapi');
const myServer = require("./config/server.json"); ///parameters for server config

// Create a server with a host and port

////connect server 1
const server = new Hapi.Server(myServer.dev)

const start = async () => {

    await server.register({
       
      
        plugin:require("./api/my_module")
      })

      await server.register({
        plugin:require("./filters/custom")
      })

    await server.start();
    console.log('Server started at: ' + server.info.uri);
}

start();
