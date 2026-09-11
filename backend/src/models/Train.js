const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const Train = sequelize.define(
  'Train',
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false, // 'PASSENGER' | 'CARGO'
    },
    category: {
      type: DataTypes.STRING(100),
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    currentStation: {
      type: DataTypes.STRING(100),
      field: 'current_station',
    },
    nextStation: {
      type: DataTypes.STRING(100),
      field: 'next_station',
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'ON TIME',
    },
    delayMinutes: {
      type: DataTypes.INTEGER,
      field: 'delay_minutes',
      defaultValue: 0,
    },
    eta: {
      type: DataTypes.STRING(20),
    },
    speed: {
      type: DataTypes.STRING(50),
      defaultValue: '0 km/h',
    },
    routeSection: {
      type: DataTypes.STRING(100),
      field: 'route_section',
    },
    platform: {
      type: DataTypes.STRING(20),
    },
    coordinates: {
      type: DataTypes.JSONB,
      defaultValue: { x: 50, y: 50 },
    },
    stops: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      field: 'last_updated',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'trains',
    timestamps: false,
  }
);

module.exports = Train;
