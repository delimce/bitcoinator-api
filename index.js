'use strict';

const Hapi = require('hapi');
const myServer = require("./config/server.json"); ///parameters for server config
var _ = require("underscore");

// Create a server with a host and port
const server = new Hapi.Server();


////connect server 1
var server1 = server.connection(myServer.dev);

//for CORS
var corsHeaders = require('hapi-cors-headers');
server1.ext('onPreResponse', corsHeaders);


//register modules
server1.register(require("./modules"), (err) => {
    if (err) {
        console.error('Failed to load api:', err);
    }
});

// Start all servers
server.start(function () {  
    // Log to the console the host and port info
    _.each(server.connections, function(connection) {
        console.log('Server started at: ' + connection.info.uri);
    });
});