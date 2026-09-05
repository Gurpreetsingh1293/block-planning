const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
  {
    stationCode: { type: String, required: true, trim: true },
    arrivalTime: { type: String, required: true }, // Format "HH:MM"
    departureTime: { type: String, required: true }, // Format "HH:MM"
    haltMinutes: { type: Number, default: 2 },
  },
  { _id: false }
);

const trainScheduleSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      example: '22436',
    },
    trainName: {
      type: String,
      required: true,
      trim: true,
      example: 'Vande Bharat Express',
    },
    trainType: {
      type: String,
      enum: ['Vande Bharat', 'Rajdhani', 'Shatabdi', 'Superfast', 'Mail/Express', 'Passenger', 'Freight'],
      required: true,
    },
    priority: {
      type: Number,
      default: 3, // 1 = highest (Vande Bharat/Rajdhani), 5 = lowest (Freights)
      min: 1,
      max: 5,
    },
    originStation: {
      type: String,
      required: true,
      trim: true,
    },
    destinationStation: {
      type: String,
      required: true,
      trim: true,
    },
    runsOnDays: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    stops: [stopSchema],
    traversedSections: {
      type: [String], // Array of section codes e.g. ['NDLS-GZB', 'GZB-CNB']
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TrainSchedule', trainScheduleSchema);
