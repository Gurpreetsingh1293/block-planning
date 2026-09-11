const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');
const User = require('./User');
const Block = require('./Block');

const BlockPlanning = sequelize.define(
  'BlockPlanning',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    slotId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'slot_id',
    },
    officerId: {
      type: DataTypes.STRING(50),
      field: 'officer_id',
    },
    officerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'officer_name',
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(100),
      defaultValue: 'Junior Engineer',
    },
    workTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'work_title',
    },
    workDescription: {
      type: DataTypes.TEXT,
      field: 'work_description',
    },
    section: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    track: {
      type: DataTypes.STRING(100),
      defaultValue: 'Main Line',
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'scheduled_date',
    },
    startTime: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'end_time',
    },
    duration: {
      type: DataTypes.STRING(50),
      defaultValue: '2 hours',
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 120,
      field: 'duration_minutes',
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Occupied',
    },
    bookingChannel: {
      type: DataTypes.STRING(50),
      defaultValue: 'Teams Calendar Web Portal',
      field: 'booking_channel',
    },
  },
  {
    tableName: 'block_planning',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define explicit relations
BlockPlanning.belongsTo(User, { foreignKey: 'officer_id', targetKey: 'userId', as: 'officer' });
BlockPlanning.belongsTo(Block, { foreignKey: 'slot_id', targetKey: 'slotId', as: 'slot' });

module.exports = BlockPlanning;
