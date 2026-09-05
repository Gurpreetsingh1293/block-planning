const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      example: 'MR-2026-001',
    },
    sectionCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
      example: 'NDLS-GZB',
    },
    department: {
      type: String,
      enum: [
        'Engineering (P-Way)',
        'Signal & Telecom (S&T)',
        'Electrical (TRD/OHE)',
        'Mechanical (C&W)',
      ],
      required: true,
    },
    workType: {
      type: String,
      required: true,
      example: 'Track Tamping and Deep Screening',
    },
    requestedDurationMinutes: {
      type: Number,
      required: true,
      min: 15,
      example: 180,
    },
    proposedDate: {
      type: Date,
      required: true,
    },
    preferredTimeSlot: {
      type: String,
      enum: ['Day', 'Night', 'Any'],
      default: 'Night',
    },
    urgency: {
      type: String,
      enum: ['Emergency', 'High', 'Routine', 'Low'],
      default: 'Routine',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Scheduled', 'Completed'],
      default: 'Pending',
    },
    reason: {
      type: String,
      required: true,
    },
    demandedBy: {
      type: String,
      default: 'Divisional Engineer (Lines)',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
