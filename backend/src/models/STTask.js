const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const STTask = sequelize.define(
  'STTask',
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    sectionId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'section_id',
    },
    trackSectionId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'track_section_id',
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'scheduled',
    },
    taskType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'task_type',
    },
    asset: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    assetId: {
      type: DataTypes.STRING(50),
      field: 'asset_id',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stationId: {
      type: DataTypes.STRING(20),
      field: 'station_id',
    },
    urgency: {
      type: DataTypes.STRING(20),
      defaultValue: 'medium',
    },
    requiredDuration: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'required_duration',
    },
    manpower: {
      type: DataTypes.STRING(100),
    },
    recommendedWindow: {
      type: DataTypes.STRING(100),
      field: 'recommended_window',
    },
    description: {
      type: DataTypes.TEXT,
    },
    affectedTracks: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'affected_tracks',
    },
    requiredBlockPath: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'required_block_path',
    },
    estimatedCost: {
      type: DataTypes.STRING(50),
      field: 'estimated_cost',
    },
    lastMaintenance: {
      type: DataTypes.DATEONLY,
      field: 'last_maintenance',
    },
    nextDue: {
      type: DataTypes.DATEONLY,
      field: 'next_due',
    },
    workStarted: {
      type: DataTypes.STRING(50),
      field: 'work_started',
    },
  },
  {
    tableName: 'st_maintenance_tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = STTask;
