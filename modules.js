'use strict'

///legacy plugins
const legacy = [];
legacy.push(require("inert"))



////my modules
const myModules = []
myModules.push(require("./api/my_module"))
myModules.push(require("./filters/custom"))
///api's
myModules.push(require("./api/Users/UserModule"))


const modules = legacy.concat(myModules);

module.exports = modules; ///export modules