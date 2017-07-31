'use strict';

var i18n_module = require('i18n-nodejs');
let config = require("../config/settings.json");
var i18n = new i18n_module(config.lang, config.langFile);



exports.getString = function (myVar) {

  return i18n.__(myVar)

}
