'use strict'

///legacy plugins
const legacy = [];
legacy.push(require("inert"))
legacy.push(require("hapi-auth-jwt2"))



////my modules
const myModules = []
myModules.push(require("./api/my_module"))
myModules.push(require("./filters/custom"))
myModules.push(require("./filters/jwt_bundle"))
///api's
myModules.push(require("./api/Users/UserModule"))


const modules = legacy.concat(myModules);

module.exports = modules; ///export modules