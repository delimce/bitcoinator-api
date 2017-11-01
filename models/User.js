const Sequelize = require('sequelize')
const db = require('./_db')


const User = db.define('User', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
            validate: {}
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {}
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {}
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {}
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {}
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue:0,
            validate: {}
        }
    },

    {
        tableName: 'tbl_user',
        freezeTableName: true,
        underscored: true,
    }
)

module.exports = User;