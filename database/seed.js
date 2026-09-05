/**
 * Standalone MongoDB Seeder Script for SIH Block Planning
 * Inserts sample railway track sections, train schedules, and maintenance requests.
 * Run using: node seed.js
 */

const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Try loading env from local database folder, then fall back to backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sih-block-planning';

// Inline Schema definitions for standalone execution
const sectionSchema = new mongoose.Schema({
  sectionCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  startStation: { type: String, required: true },
  endStation: { type: String, required: true },
  lengthKm: { type: Number, required: true },
  trackType: { type: String, default: 'Electrified Double' },
  maxSpeedKmph: { type: Number, default: 130 },
  signallingType: { type: String, default: 'Automatic Block Signalling' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const trainScheduleSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  trainType: { type: String, required: true },
  priority: { type: Number, default: 3 },
  originStation: { type: String, required: true },
  destinationStation: { type: String, required: true },
  runsOnDays: [String],
  stops: Array,
  traversedSections: [String],
}, { timestamps: true });

const maintenanceRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  sectionCode: { type: String, required: true },
  department: { type: String, required: true },
  workType: { type: String, required: true },
  requestedDurationMinutes: { type: Number, required: true },
  proposedDate: { type: Date, required: true },
  preferredTimeSlot: { type: String, default: 'Night' },
  urgency: { type: String, default: 'Routine' },
  status: { type: String, default: 'Pending' },
  reason: { type: String, required: true },
  demandedBy: { type: String, default: 'Senior Section Engineer' },
}, { timestamps: true });

const Section = mongoose.models.Section || mongoose.model('Section', sectionSchema);
const TrainSchedule = mongoose.models.TrainSchedule || mongoose.model('TrainSchedule', trainScheduleSchema);
const MaintenanceRequest = mongoose.models.MaintenanceRequest || mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

// Sample Data
const sampleSections = [
  {
    sectionCode: 'NDLS-GZB',
    name: 'New Delhi to Ghaziabad Junction',
    startStation: 'NDLS',
    endStation: 'GZB',
    lengthKm: 25.6,
    trackType: 'Electrified Double',
    maxSpeedKmph: 130,
    signallingType: 'Automatic Block Signalling',
    isActive: true,
  },
  {
    sectionCode: 'GZB-CNB',
    name: 'Ghaziabad to Kanpur Central',
    startStation: 'GZB',
    endStation: 'CNB',
    lengthKm: 412.0,
    trackType: 'Electrified Double',
    maxSpeedKmph: 130,
    signallingType: 'Automatic Block Signalling',
    isActive: true,
  },
  {
    sectionCode: 'KOTA-RTM',
    name: 'Kota to Ratlam Corridor',
    startStation: 'KOTA',
    endStation: 'RTM',
    lengthKm: 266.3,
    trackType: 'Electrified Double',
    maxSpeedKmph: 130,
    signallingType: 'Automatic Block Signalling',
    isActive: true,
  },
  {
    sectionCode: 'HWH-BWN',
    name: 'Howrah to Barddhaman Chord',
    startStation: 'HWH',
    endStation: 'BWN',
    lengthKm: 95.0,
    trackType: 'Multiple',
    maxSpeedKmph: 110,
    signallingType: 'Automatic Block Signalling',
    isActive: true,
  },
  {
    sectionCode: 'CSMT-KYN',
    name: 'Mumbai CSMT to Kalyan Suburban',
    startStation: 'CSMT',
    endStation: 'KYN',
    lengthKm: 53.8,
    trackType: 'Multiple',
    maxSpeedKmph: 105,
    signallingType: 'Automatic Block Signalling',
    isActive: true,
  },
];

const sampleTrainSchedules = [
  {
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    trainType: 'Vande Bharat',
    priority: 1,
    originStation: 'NDLS',
    destinationStation: 'BSB',
    runsOnDays: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    stops: [
      { stationCode: 'NDLS', arrivalTime: '06:00', departureTime: '06:00', haltMinutes: 0 },
      { stationCode: 'CNB', arrivalTime: '10:08', departureTime: '06:10', haltMinutes: 2 },
      { stationCode: 'BSB', arrivalTime: '14:00', departureTime: '14:00', haltMinutes: 0 },
    ],
    traversedSections: ['NDLS-GZB', 'GZB-CNB'],
  },
  {
    trainNumber: '12952',
    trainName: 'New Delhi - Mumbai Central Rajdhani',
    trainType: 'Rajdhani',
    priority: 1,
    originStation: 'NDLS',
    destinationStation: 'MMCT',
    runsOnDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { stationCode: 'NDLS', arrivalTime: '16:55', departureTime: '16:55', haltMinutes: 0 },
      { stationCode: 'KOTA', arrivalTime: '21:40', departureTime: '21:50', haltMinutes: 10 },
      { stationCode: 'RTM', arrivalTime: '01:05', departureTime: '01:07', haltMinutes: 2 },
    ],
    traversedSections: ['KOTA-RTM'],
  },
  {
    trainNumber: '12004',
    trainName: 'Lucknow Swarna Shatabdi',
    trainType: 'Shatabdi',
    priority: 2,
    originStation: 'NDLS',
    destinationStation: 'LJN',
    runsOnDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { stationCode: 'NDLS', arrivalTime: '06:10', departureTime: '06:10', haltMinutes: 0 },
      { stationCode: 'GZB', arrivalTime: '06:48', departureTime: '06:50', haltMinutes: 2 },
      { stationCode: 'CNB', arrivalTime: '11:20', departureTime: '11:25', haltMinutes: 5 },
    ],
    traversedSections: ['NDLS-GZB', 'GZB-CNB'],
  },
  {
    trainNumber: '12418',
    trainName: 'Prayagraj Express',
    trainType: 'Superfast',
    priority: 3,
    originStation: 'NDLS',
    destinationStation: 'PRYJ',
    runsOnDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { stationCode: 'NDLS', arrivalTime: '22:10', departureTime: '22:10', haltMinutes: 0 },
      { stationCode: 'GZB', arrivalTime: '22:42', departureTime: '22:44', haltMinutes: 2 },
    ],
    traversedSections: ['NDLS-GZB', 'GZB-CNB'],
  },
  {
    trainNumber: 'GOODS-901',
    trainName: 'CONCOR Container Express',
    trainType: 'Freight',
    priority: 5,
    originStation: 'TKD',
    destinationStation: 'JNPT',
    runsOnDays: ['Daily'],
    stops: [],
    traversedSections: ['NDLS-GZB', 'KOTA-RTM'],
  },
  {
    trainNumber: 'GOODS-504',
    trainName: 'Thermal Coal Special Rake',
    trainType: 'Freight',
    priority: 5,
    originStation: 'DHN',
    destinationStation: 'DADRI',
    runsOnDays: ['Daily'],
    stops: [],
    traversedSections: ['GZB-CNB', 'NDLS-GZB'],
  },
];

const sampleMaintenanceRequests = [
  {
    requestId: 'MR-2026-001',
    sectionCode: 'NDLS-GZB',
    department: 'Engineering (P-Way)',
    workType: 'Track Tamping and Deep Screening',
    requestedDurationMinutes: 180,
    proposedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
    preferredTimeSlot: 'Night',
    urgency: 'Routine',
    status: 'Pending',
    reason: 'Periodic ultrasonic rail testing and track surface realignment',
    demandedBy: 'Sr. DEN (Coordination)',
  },
  {
    requestId: 'MR-2026-002',
    sectionCode: 'NDLS-GZB',
    department: 'Electrical (TRD/OHE)',
    workType: 'OHE Contact Wire Renewal & Tower Wagon Inspection',
    requestedDurationMinutes: 120,
    proposedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
    preferredTimeSlot: 'Night',
    urgency: 'High',
    status: 'Pending',
    reason: 'Preventive replacement of worn contact wire at Km 14/2 - 18/6',
    demandedBy: 'Sr. DEE (TRD)',
  },
  {
    requestId: 'MR-2026-003',
    sectionCode: 'KOTA-RTM',
    department: 'Signal & Telecom (S&T)',
    workType: 'Electronic Interlocking (EI) Testing & Point Machine Overhaul',
    requestedDurationMinutes: 90,
    proposedDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    preferredTimeSlot: 'Night',
    urgency: 'Routine',
    status: 'Pending',
    reason: 'Quarterly point machine calibration and track circuit testing',
    demandedBy: 'Sr. DSTE (Signal)',
  },
];

async function seedDatabase() {
  console.log(`[Seed] Connecting to MongoDB: ${MONGO_URI}`);
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 6000 });
    console.log('[Seed] Connected successfully.');

    // Clear existing sample collections
    console.log('[Seed] Cleaning old sample records...');
    await Section.deleteMany({});
    await TrainSchedule.deleteMany({});
    await MaintenanceRequest.deleteMany({});

    // Insert Sections
    const insertedSections = await Section.insertMany(sampleSections);
    console.log(`[Seed] Inserted ${insertedSections.length} railway sections.`);

    // Insert Train Schedules
    const insertedTrains = await TrainSchedule.insertMany(sampleTrainSchedules);
    console.log(`[Seed] Inserted ${insertedTrains.length} train schedules.`);

    // Insert Maintenance Requests
    const insertedMRs = await MaintenanceRequest.insertMany(sampleMaintenanceRequests);
    console.log(`[Seed] Inserted ${insertedMRs.length} maintenance requests.`);

    console.log('----------------------------------------------------');
    console.log('✅ Database seeded successfully for local testing!');
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err.message);
    console.error('Ensure MongoDB is running locally on port 27017 or provide MONGO_URI');
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
  }
}

seedDatabase();
