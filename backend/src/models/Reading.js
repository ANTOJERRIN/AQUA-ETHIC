const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reading = sequelize.define('Reading', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    device_id: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    pH: {
        type: DataTypes.FLOAT,
        validate: { min: 0, max: 14 }
    },
    temperature: {
        type: DataTypes.FLOAT
    },
    turbidity: {
        type: DataTypes.FLOAT
    },
    dissolved_oxygen: {
        type: DataTypes.FLOAT
    },
    data_hash: {
        type: DataTypes.STRING(66),
        allowNull: false
    },
    blockchain_tx_hash: {
        type: DataTypes.STRING(66)
    },
    block_number: {
        type: DataTypes.INTEGER
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    signature: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'readings',
    timestamps: true,
    indexes: [
        { fields: ['device_id'] },
        { fields: ['timestamp'] },
        { fields: ['data_hash'] }
    ]
});

module.exports = Reading;