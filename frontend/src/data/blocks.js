/**
 * Mock Data: Coordinated Maintenance Blocks and Conflict Schedule
 */

export const DAYS_OF_WEEK = [
  { key: 'mon', label: 'Monday', date: '07 Sep' },
  { key: 'tue', label: 'Tuesday', date: '08 Sep' },
  { key: 'wed', label: 'Wednesday', date: '09 Sep' },
  { key: 'thu', label: 'Thursday', date: '10 Sep' },
  { key: 'fri', label: 'Friday', date: '11 Sep' }
];

export const TIME_SLOTS = [
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00'
];

export const INITIAL_BLOCKS = [
  {
    id: 'block-eng-1',
    department: 'Engineering',
    title: 'Track Inspection',
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
    title: 'Signal Maintenance',
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
    title: 'OHE Maintenance',
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
  // Joint window example on Tuesday
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
  // Additional schedule for other days to make calendar rich
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

export const CONFLICTS = [
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
    expectedImpact: 'LOWER OPERATIONAL CONFLICT (Zero train detentions)'
  }
];
