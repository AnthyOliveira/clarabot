const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    lastUpdate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Session;