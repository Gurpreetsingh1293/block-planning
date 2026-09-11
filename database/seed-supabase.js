/**
 * Standalone Supabase PostgreSQL Seeder for Indian Railways Block Planning
 * Reads .env from backend/.env and seeds all tables with trunk route data.
 * Run with: node database/seed-supabase.js
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL not found in backend/.env');
  process.exit(1);
}

const isSupabase = databaseUrl.includes('supabase.co') || databaseUrl.includes('pooler.supabase.com');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: isSupabase
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

// Import Models
const Corridor = require('../backend/src/models/Corridor');
const Station = require('../backend/src/models/Station');
const Train = require('../backend/src/models/Train');
const Timetable = require('../backend/src/models/Timetable');
const Block = require('../backend/src/models/Block');
const Conflict = require('../backend/src/models/Conflict');
const STTask = require('../backend/src/models/STTask');
const Metric = require('../backend/src/models/Metric');

// Seed Data
const CORRIDORS = [
  {
    id: 'corridor-main',
    name: 'Delhi - Mumbai / Howrah Trunk Corridor',
    description: 'High-density electrified mixed-traffic corridor with quad-track sections and automatic block signalling.',
    nodes: [
      { id: 'NDLS', name: 'New Delhi', code: 'NDLS', x: 78, y: 22, major: true },
      { id: 'GZB', name: 'Ghaziabad', code: 'GZB', x: 88, y: 16, major: false },
      { id: 'MTJ', name: 'Mathura', code: 'MTJ', x: 68, y: 44, major: true },
      { id: 'AGC', name: 'Agra Cantt', code: 'AGC', x: 58, y: 54, major: true },
      { id: 'KOTA', name: 'Kota Jn', code: 'KOTA', x: 38, y: 68, major: true },
      { id: 'CNB', name: 'Kanpur Central', code: 'CNB', x: 54, y: 28, major: true }
    ],
    tracks: [
      { from: 'GZB', to: 'NDLS', lineType: 'Double Electrified', speedLimit: 130 },
      { from: 'NDLS', to: 'MTJ', lineType: 'Quad Electrified (High Density)', speedLimit: 160 },
      { from: 'MTJ', to: 'AGC', lineType: 'Quad Electrified', speedLimit: 160 },
      { from: 'AGC', to: 'KOTA', lineType: 'Double Electrified (Trunk)', speedLimit: 130 },
      { from: 'NDLS', to: 'CNB', lineType: 'Double Electrified', speedLimit: 130 }
    ]
  }
];

const STATIONS = [
  { code: 'NDLS', name: 'NEW DELHI', kmPosition: 0, platforms: 16, stationType: 'junction', division: 'Northern Railway', xCoord: 100 },
  { code: 'MTJ', name: 'MATHURA JN', kmPosition: 145, platforms: 6, stationType: 'junction', division: 'North Central Railway', xCoord: 600 },
  { code: 'AGC', name: 'AGRA CANTT', kmPosition: 195, platforms: 5, stationType: 'station', division: 'North Central Railway', xCoord: 1100 },
  { code: 'JHS', name: 'JHANSI JN', kmPosition: 403, platforms: 6, stationType: 'junction', division: 'North Central Railway', xCoord: 1600 },
  { code: 'BPL', name: 'BHOPAL JN', kmPosition: 705, platforms: 6, stationType: 'junction', division: 'West Central Railway', xCoord: 2100 },
  { code: 'KOTA', name: 'KOTA JN', kmPosition: 465, platforms: 6, stationType: 'junction', division: 'West Central Railway', xCoord: 1400 },
  { code: 'GZB', name: 'GHAZIABAD', kmPosition: 25, platforms: 6, stationType: 'junction', division: 'Northern Railway', xCoord: 350 },
  { code: 'CNB', name: 'KANPUR CENTRAL', kmPosition: 435, platforms: 10, stationType: 'junction', division: 'North Central Railway', xCoord: 1800 }
];

const TRAINS = [
  {
    id: '12002',
    number: '12002',
    name: 'Bhopal Shatabdi',
    type: 'PASSENGER',
    category: 'Shatabdi Express',
    source: 'Bhopal Jn (BPL)',
    destination: 'New Delhi (NDLS)',
    currentStation: 'Agra Cantt (AGC)',
    nextStation: 'New Delhi (NDLS)',
    status: 'ON TIME',
    delayMinutes: 0,
    eta: '10:05',
    speed: '128 km/h',
    routeSection: 'Section A-B (AGC - NDLS)',
    platform: 'PF 2',
    coordinates: { x: 74, y: 38 },
    stops: [
      { station: 'Bhopal Jn', scheduled: '05:30', status: 'Departed' },
      { station: 'Gwalior', scheduled: '07:45', status: 'Departed' },
      { station: 'Agra Cantt', scheduled: '09:12', status: 'Departed' },
      { station: 'Mathura Jn', scheduled: '09:45', status: 'Passed' },
      { station: 'New Delhi', scheduled: '10:05', status: 'Approaching' }
    ],
    priority: 1
  },
  {
    id: '12952',
    number: '12952',
    name: 'Mumbai Rajdhani',
    type: 'PASSENGER',
    category: 'Rajdhani Express',
    source: 'Mumbai Central (MMCT)',
    destination: 'New Delhi (NDLS)',
    currentStation: 'Kota Jn (KOTA)',
    nextStation: 'Mathura Jn (MTJ)',
    status: 'ON TIME',
    delayMinutes: 0,
    eta: '10:05',
    speed: '130 km/h',
    routeSection: 'Section B-C (KOTA - MTJ)',
    platform: 'PF 4',
    coordinates: { x: 52, y: 55 },
    stops: [
      { station: 'Mumbai Central', scheduled: '17:00', status: 'Departed' },
      { station: 'Vadodara', scheduled: '21:30', status: 'Departed' },
      { station: 'Kota Jn', scheduled: '03:15', status: 'Departed' },
      { station: 'Mathura Jn', scheduled: '08:40', status: 'Passed' },
      { station: 'New Delhi', scheduled: '10:05', status: 'In Transit' }
    ],
    priority: 1
  },
  {
    id: '22436',
    number: '22436',
    name: 'Vande Bharat Express',
    type: 'PASSENGER',
    category: 'Vande Bharat',
    source: 'New Delhi (NDLS)',
    destination: 'Varanasi Jn (BSB)',
    currentStation: 'Ghaziabad (GZB)',
    nextStation: 'Kanpur Central (CNB)',
    status: 'ON TIME',
    delayMinutes: 0,
    eta: '14:00',
    speed: '135 km/h',
    routeSection: 'Section A-C (NDLS - CNB)',
    platform: 'PF 1',
    coordinates: { x: 82, y: 19 },
    stops: [
      { station: 'New Delhi', scheduled: '06:00', status: 'Departed' },
      { station: 'Kanpur Central', scheduled: '10:08', status: 'Approaching' },
      { station: 'Prayagraj Jn', scheduled: '12:08', status: 'Scheduled' },
      { station: 'Varanasi Jn', scheduled: '14:00', status: 'Scheduled' }
    ],
    priority: 1
  },
  {
    id: '70521',
    number: '70521',
    name: 'Coal BOXN Heavy Freight',
    type: 'CARGO',
    category: 'Dedicated Coal Corridor',
    source: 'Singrauli Coalfield',
    destination: 'Dadri DFC Yard',
    currentStation: 'Mathura Jn (MTJ)',
    nextStation: 'Palwal (PWL)',
    status: 'DELAYED 18m',
    delayMinutes: 18,
    eta: '12:30',
    speed: '68 km/h',
    routeSection: 'Section A-B (Dedicated Coal BOXN)',
    platform: 'Goods Line 1',
    coordinates: { x: 64, y: 46 },
    stops: [
      { station: 'Singrauli', scheduled: '01:00', status: 'Departed' },
      { station: 'Agra Yard', scheduled: '08:30', status: 'Departed' },
      { station: 'Mathura Yard', scheduled: '10:15', status: 'In Transit' },
      { station: 'Dadri DFC', scheduled: '12:30', status: 'Scheduled' }
    ],
    priority: 4
  },
  {
    id: '50112',
    number: '50112',
    name: 'BTPN Petroleum Rake',
    type: 'CARGO',
    category: 'Petroleum Tanker Rake',
    source: 'Mathura Refinery (MR)',
    destination: 'Ambala Depot',
    currentStation: 'Faridabad (FDB)',
    nextStation: 'Tuglakabad (TKD)',
    status: 'ON TIME',
    delayMinutes: 0,
    eta: '11:45',
    speed: '65 km/h',
    routeSection: 'Section A-B (FDB - TKD)',
    platform: 'Through Line',
    coordinates: { x: 71, y: 31 },
    stops: [
      { station: 'Mathura Refinery', scheduled: '06:00', status: 'Departed' },
      { station: 'Palwal', scheduled: '08:45', status: 'Passed' },
      { station: 'Tuglakabad', scheduled: '11:45', status: 'In Transit' }
    ],
    priority: 4
  }
];

const STATION_TIMETABLE_NDLS = [
  { stationCode: 'NDLS', trainNumber: '22436', trainName: 'Vande Bharat Express', time: '06:00', route: 'New Delhi → Varanasi', platform: 'PF 1', status: 'DEPARTED', direction: 'DN' },
  { stationCode: 'NDLS', trainNumber: '12004', trainName: 'Lucknow Shatabdi', time: '06:10', route: 'New Delhi → Lucknow Jn', platform: 'PF 3', status: 'DEPARTED', direction: 'DN' },
  { stationCode: 'NDLS', trainNumber: '12002', trainName: 'Bhopal Shatabdi', time: '10:05', route: 'Bhopal Jn → New Delhi', platform: 'PF 2', status: 'ON TIME', direction: 'UP' },
  { stationCode: 'NDLS', trainNumber: '12952', trainName: 'Mumbai Rajdhani', time: '10:05', route: 'Mumbai Central → New Delhi', platform: 'PF 4', status: 'ON TIME', direction: 'UP' },
  { stationCode: 'NDLS', trainNumber: '12424', trainName: 'Dibrugarh Rajdhani', time: '16:20', route: 'New Delhi → Dibrugarh', platform: 'PF 5', status: 'BOARDING', direction: 'DN' },
  { stationCode: 'NDLS', trainNumber: '12302', trainName: 'Howrah Rajdhani', time: '16:55', route: 'New Delhi → Howrah Jn', platform: 'PF 6', status: 'SCHEDULED', direction: 'DN' },
  { stationCode: 'NDLS', trainNumber: '70521', trainName: 'Coal BOXN Freight', time: '12:30', route: 'Singrauli → Dadri DFC', platform: 'Goods 1', status: 'DELAYED (18m)', direction: 'DN' }
];

const MAINTENANCE_BLOCKS = [
  {
    id: 'block-eng-1',
    department: 'Engineering',
    title: 'Track Inspection & Flaw Detection',
    section: 'Section A-B (Mathura - New Delhi)',
    day: 'mon',
    startTime: '08:00',
    endTime: '10:00',
    startHour: 8.0,
    durationHours: 2.0,
    status: 'Scheduled',
    gangStrength: '18 Trackmen',
    machineType: 'UNIMAT Tamping Machine',
    priority: 'High',
    coordinatedWith: ['S&T'],
    description: 'Ultrasonic flaw detection & point machine clearance check'
  },
  {
    id: 'block-snt-1',
    department: 'S&T',
    title: 'Signal Maintenance & Sensor Calibration',
    section: 'Section A-B (Palwal - Ballabgarh)',
    day: 'mon',
    startTime: '09:00',
    endTime: '10:30',
    startHour: 9.0,
    durationHours: 1.5,
    status: 'Approved',
    gangStrength: '6 Technicians',
    machineType: 'Electronic Interlocking Rig',
    priority: 'Medium',
    coordinatedWith: ['Engineering'],
    description: 'Axle counter reset & point sensor recalibration'
  },
  {
    id: 'block-trd-1',
    department: 'TRD',
    title: 'OHE Maintenance & Wire Alignment',
    section: 'Section A-B (Faridabad - Tuglakabad)',
    day: 'mon',
    startTime: '10:00',
    endTime: '12:00',
    startHour: 10.0,
    durationHours: 2.0,
    status: 'Under Review',
    gangStrength: '12 Linesmen',
    machineType: 'Tower Wagon Rake #4',
    priority: 'Critical',
    coordinatedWith: ['Engineering', 'S&T'],
    description: '25kV Over-Head Equipment insulator wash & cantilever alignment'
  },
  {
    id: 'block-frt-1',
    department: 'Freight',
    title: 'Freight 70521 (High Traffic)',
    section: 'Section A-B (Dedicated Coal BOXN)',
    day: 'mon',
    startTime: '11:00',
    endTime: '13:00',
    startHour: 11.0,
    durationHours: 2.0,
    status: 'Scheduled',
    gangStrength: 'Crew: 2 Drivers, 1 Guard',
    machineType: 'WAG-9 Twin Heavy Haul',
    priority: 'High Corridor Freight',
    description: 'Heavy coal rake transiting from MTJ yard to Dadri DFC'
  },
  {
    id: 'block-joint-1',
    department: 'Joint Multi-Dept Window',
    title: 'Multi-Department Mega Block',
    section: 'Section B-C (Kota - Mathura)',
    day: 'tue',
    startTime: '12:00',
    endTime: '15:00',
    startHour: 12.0,
    durationHours: 3.0,
    status: 'Approved',
    gangStrength: '34 Personnel (Engg + S&T + TRD)',
    machineType: 'BCM (Ballast Cleaning) + Tower Wagon',
    priority: 'High',
    coordinatedWith: ['Engineering', 'S&T', 'TRD'],
    description: 'Synchronized ballast cleaning and contact wire renewal during low-traffic window'
  },
  {
    id: 'block-eng-2',
    department: 'Engineering',
    title: 'Turnout Renewal & Packing',
    section: 'Section A-C (Ghaziabad)',
    day: 'wed',
    startTime: '08:00',
    endTime: '11:00',
    startHour: 8.0,
    durationHours: 3.0,
    status: 'Scheduled',
    gangStrength: '22 Personnel',
    machineType: 'CSM Tamper',
    priority: 'High',
    coordinatedWith: ['S&T'],
    description: 'Heavy turnout renewal on Line 3'
  },
  {
    id: 'block-trd-2',
    department: 'TRD',
    title: 'OHE Neutral Section Inspection',
    section: 'Section A-B (Agra Cantt)',
    day: 'thu',
    startTime: '14:00',
    endTime: '16:30',
    startHour: 14.0,
    durationHours: 2.5,
    status: 'Requested',
    gangStrength: '8 Personnel',
    machineType: 'Tower Car',
    priority: 'Medium',
    coordinatedWith: [],
    description: 'Routine power block for neutral section insulator check'
  }
];

function generateCalendarBlocks() {
  const today = new Date();
  const getDate = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'SLOT-2026-001', slotId: 'SLOT-2026-001',
      title: 'Track Renewal & Tamping', department: 'Civil',
      startTime: '09:00', endTime: '12:00', startHour: 9.0,
      duration: '3 hours', durationMinutes: 180, durationHours: 3.0,
      status: 'Occupied', bookedBy: 'Rajesh Verma (SSE/P-Way)', inCharge: 'Rajesh Verma (SSE/P-Way)',
      date: getDate(0), dateLabel: String(new Date(getDate(0)).getDate()), dayIndex: new Date(getDate(0)).getDay(),
      section: 'NDLS - AGC Quadruple Corridor', track: 'Up Slow Line',
      colorKey: 'gold', deptTag: 'Civil Dept',
      description: 'Heavy ballast cleaning and track tamping at km 47.5 to 49.2',
      isClickable: false, adminCreated: true, day: 'mon'
    },
    {
      id: 'SLOT-2026-002', slotId: 'SLOT-2026-002',
      title: 'OHE Maintenance & Insulator Wash', department: 'Electrical',
      startTime: '14:00', endTime: '17:00', startHour: 14.0,
      duration: '3 hours', durationMinutes: 180, durationHours: 3.0,
      status: 'Occupied', bookedBy: 'Sunil Mehta (DEE/TRD)', inCharge: 'Sunil Mehta (DEE/TRD)',
      date: getDate(1), dateLabel: String(new Date(getDate(1)).getDate()), dayIndex: new Date(getDate(1)).getDay(),
      section: 'Faridabad - Tuglakabad', track: 'Main Line',
      colorKey: 'terracotta', deptTag: 'Electrical Dept',
      description: '25kV OHE insulator washing and cantilever alignment check',
      isClickable: false, adminCreated: true, day: 'tue'
    },
    {
      id: 'SLOT-2026-003', slotId: 'SLOT-2026-003',
      title: 'Signal & Interlocking Maintenance', department: 'Signal',
      startTime: '10:00', endTime: '13:00', startHour: 10.0,
      duration: '3 hours', durationMinutes: 180, durationHours: 3.0,
      status: 'Occupied', bookedBy: 'Anand Sharma (SE/Signal)', inCharge: 'Anand Sharma (SE/Signal)',
      date: getDate(2), dateLabel: String(new Date(getDate(2)).getDate()), dayIndex: new Date(getDate(2)).getDay(),
      section: 'Palwal - Ballabgarh', track: 'Down Main Line',
      colorKey: 'teal', deptTag: 'Signal Dept',
      description: 'Electronic interlocking system test and axle counter reset',
      isClickable: false, adminCreated: true, day: 'wed'
    },
    {
      id: 'SLOT-2026-004', slotId: 'SLOT-2026-004',
      title: 'Available Maintenance Slot', department: null,
      startTime: '08:00', endTime: '10:00', startHour: 8.0,
      duration: '2 hours', durationMinutes: 120, durationHours: 2.0,
      status: 'Available', bookedBy: null, inCharge: null,
      date: getDate(3), dateLabel: String(new Date(getDate(3)).getDate()), dayIndex: new Date(getDate(3)).getDay(),
      section: 'NDLS - MTJ Outer Yard', track: 'Up Slow Line',
      colorKey: 'white', deptTag: 'Available',
      description: 'Open for Junior Engineer booking',
      isClickable: true, adminCreated: true, day: 'thu'
    },
    {
      id: 'SLOT-2026-005', slotId: 'SLOT-2026-005',
      title: 'Telecom Fiber Optic Cable Laying', department: 'Signal & Telecom',
      startTime: '11:00', endTime: '14:00', startHour: 11.0,
      duration: '3 hours', durationMinutes: 180, durationHours: 3.0,
      status: 'Occupied', bookedBy: 'Pradeep Kumar (JE/Telecom)', inCharge: 'Pradeep Kumar (JE/Telecom)',
      date: getDate(4), dateLabel: String(new Date(getDate(4)).getDate()), dayIndex: new Date(getDate(4)).getDay(),
      section: 'Ghaziabad Junction Yard', track: 'Loop Line 2',
      colorKey: 'purple', deptTag: 'Telecom Dept',
      description: 'OFC jointing and OTDR signal loss measurement testing',
      isClickable: false, adminCreated: true, day: 'fri'
    },
    {
      id: 'SLOT-2026-006', slotId: 'SLOT-2026-006',
      title: 'Available Maintenance Slot', department: null,
      startTime: '15:00', endTime: '18:00', startHour: 15.0,
      duration: '3 hours', durationMinutes: 180, durationHours: 3.0,
      status: 'Available', bookedBy: null, inCharge: null,
      date: getDate(5), dateLabel: String(new Date(getDate(5)).getDate()), dayIndex: new Date(getDate(5)).getDay(),
      section: 'Agra Cantt - Mathura Junction', track: 'Main Line',
      colorKey: 'white', deptTag: 'Available',
      description: 'Pre-cleared 3-hour possession window open for claims',
      isClickable: true, adminCreated: true, day: 'sat'
    },
    {
      id: 'SLOT-2026-007', slotId: 'SLOT-2026-007',
      title: 'Ultrasonic Rail Flaw Detection (USFD)', department: 'Civil',
      startTime: '07:00', endTime: '10:00', startHour: 7.0,
      duration: '3 hours', durationMinutes: 180, durationHours: 3.0,
      status: 'Occupied', bookedBy: 'Amit Singh (SSE/P-Way)', inCharge: 'Amit Singh (SSE/P-Way)',
      date: getDate(6), dateLabel: String(new Date(getDate(6)).getDate()), dayIndex: new Date(getDate(6)).getDay(),
      section: 'Kota Junction Yard', track: 'Main Line',
      colorKey: 'gold', deptTag: 'Civil Dept',
      description: 'Periodic ultrasonic testing of rail head and weld joints',
      isClickable: false, adminCreated: true, day: 'sun'
    }
  ];
}

const CONFLICTS = [
  {
    id: 'conf-1',
    title: 'FREIGHT CONFLICT DETECTED',
    section: 'SECTION A-B',
    currentWindow: '10:00–12:00',
    affectedBlockId: 'block-trd-1',
    conflictingTraffic: 'Freight 70521 (Dedicated Coal Corridor)',
    conflictTime: '11:15',
    severity: 'HIGH',
    impact: 'Potential 45-min bottleneck for 4,850 MT coal rake',
    suggestedWindow: '13:00–15:00',
    aiReason: 'Lower freight conflict & clear path between scheduled Rajdhani paths',
    expectedImpact: 'LOWER OPERATIONAL CONFLICT (Zero train detentions)',
    isResolved: false
  }
];

const ST_TASKS = [
  {
    id: 'MAINT-001',
    sectionId: 'SEC-NDLS-MTJ-DN',
    trackSectionId: 'SEC-NDLS-MTJ-DN',
    status: 'scheduled',
    taskType: 'signal',
    asset: 'Signal S102',
    assetId: 'S102',
    location: 'New Delhi Jn - KM 2.5',
    stationId: 'NDLS',
    urgency: 'medium',
    requiredDuration: '3 hours',
    manpower: '2 technicians + 1 supervisor',
    recommendedWindow: '2026-09-11 02:00 - 05:00',
    description: 'LED aspect replacement and alignment check',
    affectedTracks: ['DN_MAIN'],
    requiredBlockPath: ['P101', 'P102', 'S101', 'S102'],
    estimatedCost: '₹15,000',
    lastMaintenance: '2026-06-10',
    nextDue: '2026-09-15'
  },
  {
    id: 'MAINT-002',
    sectionId: 'SEC-NDLS-MTJ-UP',
    trackSectionId: 'SEC-NDLS-MTJ-UP',
    status: 'inProgress',
    taskType: 'track',
    asset: 'Track Circuit TC-103',
    assetId: 'TC-103',
    location: 'New Delhi - Mathura Section - KM 25',
    stationId: 'NDLS',
    urgency: 'high',
    requiredDuration: '4 hours',
    manpower: '3 technicians',
    recommendedWindow: '2026-09-10 22:00 - 02:00',
    description: 'Track circuit relay replacement due to intermittent faults',
    affectedTracks: ['UP_MAIN'],
    requiredBlockPath: ['P103', 'P104', 'S103', 'S104'],
    estimatedCost: '₹25,000',
    lastMaintenance: '2026-03-15',
    nextDue: '2026-09-12',
    workStarted: '2026-09-10 22:30'
  },
  {
    id: 'MAINT-003',
    sectionId: 'SEC-MTJ-AGC-DN',
    trackSectionId: 'SEC-MTJ-AGC-DN',
    status: 'scheduled',
    taskType: 'point',
    asset: 'Point Machine P201',
    assetId: 'P201',
    location: 'Mathura Jn - Entry Point',
    stationId: 'MTJ',
    urgency: 'medium',
    requiredDuration: '5 hours',
    manpower: '4 technicians + 1 supervisor',
    recommendedWindow: '2026-09-12 01:00 - 06:00',
    description: 'Overhaul point motor and lubricate switch rails',
    affectedTracks: ['LOOP_1', 'DN_MAIN'],
    requiredBlockPath: ['P201', 'P202', 'S201'],
    estimatedCost: '₹35,000',
    lastMaintenance: '2026-05-20',
    nextDue: '2026-09-20'
  },
  {
    id: 'MAINT-004',
    sectionId: 'SEC-AGC-JHS-UP',
    trackSectionId: 'SEC-AGC-JHS-UP',
    status: 'overdue',
    taskType: 'interlocking',
    asset: 'Electronic Interlocking Rack EI-02',
    assetId: 'EI-02',
    location: 'Agra Cantt Relay Room',
    stationId: 'AGC',
    urgency: 'critical',
    requiredDuration: '2 hours',
    manpower: 'Senior Section Engineer (Signal)',
    recommendedWindow: 'Immediate Window Required',
    description: 'Redundant CPU diagnostic test and firmware verification',
    affectedTracks: ['ALL_PLATFORMS'],
    requiredBlockPath: ['EI_SYS_BUS'],
    estimatedCost: '₹50,000',
    lastMaintenance: '2025-12-10',
    nextDue: '2026-09-01'
  }
];

const METRICS = {
  totalMonitored: 124,
  onTime: 118,
  delayed: 6,
  corridorsActive: 5,
  freightInTransit: 38,
  passengerInTransit: 86,
  averageNetworkSpeed: '94.2 km/h',
  criticalAlerts: 1
};

async function seed() {
  console.log('🚆 Connecting to Supabase PostgreSQL at:', databaseUrl.replace(/:[^:]*@/, ':***@'));
  await sequelize.authenticate();
  console.log('✅ Connected successfully to Supabase PostgreSQL.');

  // Read and execute schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const ddl = fs.readFileSync(schemaPath, 'utf8');
    console.log('📝 Executing database/schema.sql...');
    await sequelize.query(ddl);
    console.log('✅ Tables verified and created in Supabase.');
  }

  // 1. Seed Corridors
  console.log('📦 Seeding Corridors...');
  for (const c of CORRIDORS) {
    await Corridor.upsert(c);
  }

  // 2. Seed Stations
  console.log('🚉 Seeding Stations...');
  for (const s of STATIONS) {
    await Station.upsert(s);
  }

  // 3. Seed Trains
  console.log('🚅 Seeding Trains & Live Movement Telemetry...');
  for (const t of TRAINS) {
    await Train.upsert(t);
  }

  // 4. Seed Station Timetables
  console.log('🕒 Seeding Station Timetables (NDLS Platform Board)...');
  await Timetable.destroy({ where: {} });
  await Timetable.bulkCreate(STATION_TIMETABLE_NDLS);

  // 5. Seed Maintenance Blocks
  console.log('🔨 Seeding Maintenance Blocks (Engineering, S&T, TRD, Joint + Active Calendar Slots)...');
  await sequelize.query('ALTER TABLE maintenance_blocks ALTER COLUMN department DROP NOT NULL;');
  await sequelize.query('ALTER TABLE maintenance_blocks ALTER COLUMN day DROP NOT NULL;');
  for (const b of MAINTENANCE_BLOCKS) {
    await Block.upsert(b);
  }
  const calendarBlocks = generateCalendarBlocks();
  for (const cb of calendarBlocks) {
    await Block.upsert(cb);
  }

  // 6. Seed Block Conflicts
  console.log('⚠️ Seeding Block Conflicts...');
  for (const conf of CONFLICTS) {
    await Conflict.upsert(conf);
  }

  // 7. Seed S&T Tasks
  console.log('🚦 Seeding S&T Maintenance Tasks...');
  for (const st of ST_TASKS) {
    await STTask.upsert(st);
  }

  // 8. Seed Network Metrics
  console.log('📊 Seeding Network Metrics...');
  await Metric.destroy({ where: {} });
  await Metric.create(METRICS);

  console.log('\n=============================================================');
  console.log('🎉 SUPABASE SEEDING COMPLETE! All Indian Railways tables ready.');
  console.log('=============================================================');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
