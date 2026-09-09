const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Railway User / Employee ID, e.g. ENG001, SNT001, TRD001',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Full Name of the Railway Official',
    },
    department: {
      type: DataTypes.ENUM('engineering', 'snt', 'traction'),
      allowNull: false,
      comment: 'Engineering, Signal & Telecommunication, or Traction Distribution',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Bcrypt hashed password',
    },
    designation: {
      type: DataTypes.STRING,
      defaultValue: 'Section Engineer',
      comment: 'e.g. Senior Section Engineer (P-Way), DEE (TRD), DSTE (Signal)',
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'engineer',
      comment: 'supervisor, engineer, controller, admin',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
