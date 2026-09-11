const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const Conflict = sequelize.define(
  'Conflict',
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    currentWindow: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'current_window',
    },
    affectedBlockId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'affected_block_id',
    },
    conflictingTraffic: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'conflicting_traffic',
    },
    conflictTime: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'conflict_time',
    },
    severity: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    impact: {
      type: DataTypes.TEXT,
    },
    suggestedWindow: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'suggested_window',
    },
    aiReason: {
      type: DataTypes.TEXT,
      field: 'ai_reason',
    },
    expectedImpact: {
      type: DataTypes.TEXT,
      field: 'expected_impact',
    },
    isResolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_resolved',
    },
  },
  {
    tableName: 'block_conflicts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Conflict;
