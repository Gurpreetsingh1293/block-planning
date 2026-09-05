const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    sectionCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      example: 'NDLS-GZB',
    },
    name: {
      type: String,
      required: true,
      trim: true,
      example: 'New Delhi to Ghaziabad Junction',
    },
    startStation: {
      type: String,
      required: true,
      trim: true,
      example: 'NDLS',
    },
    endStation: {
      type: String,
      required: true,
      trim: true,
      example: 'GZB',
    },
    lengthKm: {
      type: Number,
      required: true,
      min: 0,
    },
    trackType: {
      type: String,
      enum: ['Single', 'Double', 'Multiple', 'Electrified Double'],
      default: 'Electrified Double',
    },
    maxSpeedKmph: {
      type: Number,
      default: 130,
      min: 10,
    },
    signallingType: {
      type: String,
      default: 'Automatic Block Signalling',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Section', sectionSchema);
