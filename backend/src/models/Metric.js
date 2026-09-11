const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const Metric = sequelize.define(
  'Metric',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    totalMonitored: {
      type: DataTypes.INTEGER,
      defaultValue: 124,
      field: 'total_monitored',
    },
    onTime: {
      type: DataTypes.INTEGER,
      defaultValue: 118,
      field: 'on_time',
    },
    delayed: {
      type: DataTypes.INTEGER,
      defaultValue: 6,
    },
    corridorsActive: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      field: 'corridors_active',
    },
    freightInTransit: {
      type: DataTypes.INTEGER,
      defaultValue: 38,
      field: 'freight_in_transit',
    },
    passengerInTransit: {
      type: DataTypes.INTEGER,
      defaultValue: 86,
      field: 'passenger_in_transit',
    },
    averageNetworkSpeed: {
      type: DataTypes.STRING(50),
      defaultValue: '94.2 km/h',
      field: 'average_network_speed',
    },
    criticalAlerts: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'critical_alerts',
    },
  },
  {
    tableName: 'network_metrics',
    timestamps: true,
    createdAt: 'recorded_at',
    updatedAt: false,
  }
);

module.exports = Metric;
