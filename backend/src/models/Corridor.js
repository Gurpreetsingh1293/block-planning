const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const Corridor = sequelize.define(
  'Corridor',
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    nodes: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    tracks: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    tableName: 'corridors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Corridor;
