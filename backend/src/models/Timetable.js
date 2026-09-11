const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const Timetable = sequelize.define(
  'Timetable',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    stationCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'station_code',
    },
    trainNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'train_number',
    },
    trainName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'train_name',
    },
    time: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    route: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    direction: {
      type: DataTypes.STRING(10),
      defaultValue: 'DN',
    },
  },
  {
    tableName: 'station_timetables',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Timetable;
