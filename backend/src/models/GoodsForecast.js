const mongoose = require('mongoose');

const goodsForecastSchema = new mongoose.Schema(
  {
    forecastId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      example: 'GF-2026-101',
    },
    date: {
      type: Date,
      required: true,
    },
    originDivision: {
      type: String,
      required: true,
      example: 'Delhi Division (DLI)',
    },
    destinationDivision: {
      type: String,
      required: true,
      example: 'Moradabad Division (MB)',
    },
    corridorSection: {
      type: String,
      required: true,
      example: 'NDLS-GZB',
    },
    commodity: {
      type: String,
      enum: ['Coal', 'Containers', 'Cement', 'Fertilizers', 'Foodgrains', 'POL/Petroleum', 'Steel', 'Mixed'],
      default: 'Containers',
    },
    expectedRakes: {
      type: Number,
      required: true,
      min: 1,
      default: 5,
    },
    rakeType: {
      type: String,
      default: 'BOXN', // BOXN, BCN, BTPN, container flats
    },
    priority: {
      type: String,
      enum: ['High', 'Standard', 'Low'],
      default: 'Standard',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GoodsForecast', goodsForecastSchema);
