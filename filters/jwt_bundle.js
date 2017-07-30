const jwt_bundle = {
    register: function (server, options, next) {
        // add functionality -> we’ll do that in the section below


        // bring your own validation function
        var validate = function (decoded, request, callback) {

            // do your checks to see if the person is valid

            /*    if (!people[decoded.id]) {
             return callback(null, false);
             }
             else {
             return callback(null, true);
             }*/

            return callback(null, true);


        };


        const token = require("../config/jwt.json");

        server.auth.strategy('jwt', 'jwt',
            {
                key: token.secret,          // Never Share your secret key
                validateFunc: validate,            // validate function defined above
                verifyOptions: {algorithms: ['HS256']} // pick a strong algorithm
            });

        server.auth.default('jwt');


        // call next() to signal hapi that your plugin has done the job
        next()
    }
}


jwt_bundle.register.attributes = {
    name: 'jwt_bundle',
    version: '1.0.0'
};

module.exports = jwt_bundle;