const mongoose = require('mongoose');

const impactedTrainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String, required: true },
    trainName: { type: String, required: true },
    estimatedDelayMinutes: { type: Number, default: 0 },
    action: {
      type: String,
      enum: ['Regulated', 'Diverted', 'Rescheduled', 'Cancelled', 'Unaffected'],
      default: 'Regulated',
    },
  },
  { _id: false }
);

const blockPlanSchema = new mongoose.Schema(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      example: 'BP-2026-5001',
    },
    planDate: {
      type: Date,
      required: true,
    },
    sectionCode: {
      type: String,
      required: true,
      trim: true,
      example: 'NDLS-GZB',
    },
    maintenanceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceRequest',
      required: false,
    },
    windowStart: {
      type: Date,
      required: true,
    },
    windowEnd: {
      type: Date,
      required: true,
    },
    allocatedDurationMinutes: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Conflict_Detected', 'Optimized', 'Approved', 'Executed', 'Cancelled'],
      default: 'Draft',
    },
    impactedTrains: [impactedTrainSchema],
    mlRiskScore: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
    aiRecommendations: {
      type: String,
      default: '',
    },
    approvedBy: {
      type: String,
      default: 'Chief Controller / Operating',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BlockPlan', blockPlanSchema);
