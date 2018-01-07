const Sequelize = require('sequelize');
const env = require("../config/db.json").dev;
const db = new Sequelize(env.url,env.pool); ///connect from url
module.exports = db;