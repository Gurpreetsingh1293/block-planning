const mongoose = require('mongoose');

/**
 * Block Schema for Railway Maintenance Block Planning
 * Represents Available and Occupied maintenance slots on the timeline calendar
 */

// Normalizes status string: 'available' -> 'Available', 'occupied'/'booked' -> 'Occupied'
function normalizeStatus(val) {
  if (!val) return 'Available';
  const v = String(val).toLowerCase().trim();
  if (v === 'available') return 'Available';
  if (v === 'occupied' || v === 'booked') return 'Occupied';
  return val;
}

// Safely extracts name from object or returns string
function normalizeBookedBy(val) {
  if (!val) return null;
  if (typeof val === 'object' && val.name) return val.name;
  if (typeof val === 'string') return val.trim();
  return null;
}

const blockSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      example: 'Civil works',
    },
    department: {
      type: String,
      default: null,
      trim: true,
      enum: [null, 'Civil', 'Electrical', 'Signal', 'Signal & Telecom', 'Mechanical', 'Operations'],
      example: 'Civil',
    },
    startTime: {
      type: String, // Formatted time string like "10:00 AM" or "22:00"
      default: () => new Date().toISOString(),
      example: '10:00 AM',
    },
    endTime: {
      type: String,
      required: true,
      example: '11:00 AM',
    },
    duration: {
      type: mongoose.Schema.Types.Mixed, // Can be String like '1 hour' or Number
      default: '1 hour',
      example: '1 hour',
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
      example: 60,
    },
    durationHours: {
      type: Number,
      required: true,
      min: 0,
      example: 1,
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied'],
      default: 'Available',
      set: normalizeStatus,
    },
    bookedBy: {
      type: String,
      default: null,
      set: normalizeBookedBy,
      example: 'Ramesh Kumar',
    },
    inCharge: {
      type: String,
      default: null,
      trim: true,
      example: 'Ramesh Kumar (SSE/P-Way)',
    },
    slotId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      example: 'SLOT-2026-001',
    },
    id: {
      type: String,
      required: false,
      index: true,
      trim: true,
      example: 'SLOT-2026-001',
    },
    date: {
      type: String, // ISO date string in local format YYYY-MM-DD
      required: true,
      index: true,
      example: '2026-09-10',
    },
    dateLabel: {
      type: String,
      default: '1',
      example: '16',
    },
    dayIndex: {
      type: Number,
      min: 0,
      max: 6,
      required: true,
      example: 3, // Wednesday
    },
    section: {
      type: String,
      default: 'General Section',
      trim: true,
      example: 'NDLS - AGC Quadruple Corridor',
    },
    track: {
      type: String,
      default: 'Main Line',
      trim: true,
      example: 'Up Slow Line',
    },
    colorKey: {
      type: String,
      enum: ['gold', 'teal', 'terracotta', 'purple', 'white', 'gray'],
      default: 'white',
      example: 'gold',
    },
    deptTag: {
      type: String,
      default: 'Available',
      trim: true,
      example: 'Civil Dept',
    },
    description: {
      type: String,
      default: '',
      trim: true,
      example: 'Track tamping and ballast renewal on Up Line km 45.200 to 47.500',
    },
    isClickable: {
      type: Boolean,
      default: false,
    },
    adminCreated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for query performance
blockSchema.index({ date: 1, startTime: 1 });
blockSchema.index({ status: 1 });
blockSchema.index({ department: 1 });
blockSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Block', blockSchema);
