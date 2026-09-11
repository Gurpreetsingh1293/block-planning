const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const Station = sequelize.define(
  'Station',
  {
    code: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kmPosition: {
      type: DataTypes.NUMERIC(8, 2),
      field: 'km_position',
      defaultValue: 0,
    },
    platforms: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
    },
    stationType: {
      type: DataTypes.STRING(50),
      field: 'station_type',
      defaultValue: 'junction',
    },
    division: {
      type: DataTypes.STRING(100),
      defaultValue: 'Northern Railway',
    },
    xCoord: {
      type: DataTypes.INTEGER,
      field: 'x_coord',
      defaultValue: 0,
    },
  },
  {
    tableName: 'stations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Station;
