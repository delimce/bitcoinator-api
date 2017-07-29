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
        }
    },

    {
        tableName: 'tbl_user',
        freezeTableName: true,
        timestamps:false,
        underscored: true,
    }
)

module.exports = User;