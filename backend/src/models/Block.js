const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const Block = sequelize.define(
  'Block',
  {
    id: {
      type: DataTypes.STRING(100),
      primaryKey: true,
    },
    slotId: {
      type: DataTypes.STRING(100),
      unique: true,
      field: 'slot_id',
    },
    department: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    deptTag: {
      type: DataTypes.STRING(50),
      field: 'dept_tag',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    track: {
      type: DataTypes.STRING(100),
      defaultValue: 'Main Line',
      field: 'track',
    },
    date: {
      type: DataTypes.DATEONLY,
      field: 'date',
    },
    dateLabel: {
      type: DataTypes.STRING(10),
      field: 'date_label',
    },
    dayIndex: {
      type: DataTypes.INTEGER,
      field: 'day_index',
    },
    day: {
      type: DataTypes.STRING(10),
      defaultValue: 'mon',
      field: 'day',
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
    startHour: {
      type: DataTypes.NUMERIC(4, 2),
      defaultValue: 9.0,
      field: 'start_hour',
    },
    duration: {
      type: DataTypes.STRING(50),
      defaultValue: '1 hour',
      field: 'duration',
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      field: 'duration_minutes',
    },
    durationHours: {
      type: DataTypes.NUMERIC(4, 2),
      defaultValue: 1.0,
      field: 'duration_hours',
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Available',
    },
    bookedBy: {
      type: DataTypes.STRING(255),
      field: 'booked_by',
    },
    inCharge: {
      type: DataTypes.STRING(255),
      field: 'in_charge',
    },
    colorKey: {
      type: DataTypes.STRING(50),
      defaultValue: 'white',
      field: 'color_key',
    },
    gangStrength: {
      type: DataTypes.STRING(100),
      field: 'gang_strength',
    },
    machineType: {
      type: DataTypes.STRING(100),
      field: 'machine_type',
    },
    priority: {
      type: DataTypes.STRING(50),
      defaultValue: 'Medium',
    },
    coordinatedWith: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'coordinated_with',
    },
    description: {
      type: DataTypes.TEXT,
    },
    isClickable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_clickable',
    },
    adminCreated: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'admin_created',
    },
    isOptimized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_optimized',
    },
    optimizationNote: {
      type: DataTypes.TEXT,
      field: 'optimization_note',
    },
  },
  {
    tableName: 'maintenance_blocks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Block;
