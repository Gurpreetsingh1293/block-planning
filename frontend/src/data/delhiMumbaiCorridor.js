/**
 * Delhi-Mumbai Railway Corridor Data
 * 
 * Comprehensive data structure for the Delhi-Mumbai railway corridor
 * including stations, tracks, signals, points, track circuits, and infrastructure.
 * 
 * Coordinates are in SVG viewBox space: 0-3600 horizontal, 0-600 vertical
 * Each station occupies ~500-600 units horizontally
 */

// Station information with realistic details
export const stations = [
  {
    id: "NDLS",
    name: "NEW DELHI",
    code: "NDLS",
    kmPosition: 0,
    x: 100, // SVG x-coordinate for station center
    platforms: 16,
    stationType: "junction",
    hasStationBuilding: true
  },
  {
    id: "MTJ",
    name: "MATHURA JN",
    code: "MTJ",
    kmPosition: 145,
    x: 600,
    platforms: 6,
    stationType: "junction",
    hasStationBuilding: true
  },
  {
    id: "AGC",
    name: "AGRA CANTT",
    code: "AGC",
    kmPosition: 195,
    x: 1100,
    platforms: 5,
    stationType: "station",
    hasStationBuilding: true
  },
  {
    id: "JHS",
    name: "JHANSI JN",
    code: "JHS",
    kmPosition: 403,
    x: 1600,
    platforms: 6,
    stationType: "junction",
    hasStationBuilding: true
  },
  {
    id: "BPL",
    name: "BHOPAL JN",
    code: "BPL",
    kmPosition: 705,
    x: 2100,
    platforms: 6,
    stationType: "junction",
    hasStationBuilding: true
  },
  {
    id: "BRC",
    name: "VADODARA JN",
    code: "BRC",
    kmPosition: 1094,
    x: 2600,
    platforms: 7,
    stationType: "junction",
    hasStationBuilding: true
  },
  {
    id: "MMCT",
    name: "MUMBAI CENTRAL",
    code: "MMCT",
    kmPosition: 1384,
    x: 3100,
    platforms: 7,
    stationType: "terminal",
    hasStationBuilding: true
  }
];

// Main tracks running through the corridor
// y-coordinates: DN_MAIN=150, UP_MAIN=450, with loops/sidings between
export const tracks = [
  {
    id: "DN_MAIN",
    label: "DN MAIN",
    y: 150,
    x1: 0,
    x2: 3600,
    direction: "DOWN",
    lineType: "main"
  },
  {
    id: "UP_MAIN",
    label: "UP MAIN",
    y: 450,
    x1: 0,
    x2: 3600,
    direction: "UP",
    lineType: "main"
  }
];

// Railway points (turnouts) at each station
// Position: NORMAL (straight), REVERSE (diverging), LOCKED (route set)
export const points = [
  // NEW DELHI station points
  { id: "P101", stationId: "NDLS", track1: { x: 80, y: 150 }, track2: { x: 120, y: 250 }, position: "NORMAL", locked: false },
  { id: "P102", stationId: "NDLS", track1: { x: 200, y: 150 }, track2: { x: 240, y: 250 }, position: "NORMAL", locked: false },
  { id: "P103", stationId: "NDLS", track1: { x: 80, y: 450 }, track2: { x: 120, y: 350 }, position: "NORMAL", locked: false },
  { id: "P104", stationId: "NDLS", track1: { x: 200, y: 450 }, track2: { x: 240, y: 350 }, position: "NORMAL", locked: false },

  // MATHURA JN points
  { id: "P201", stationId: "MTJ", track1: { x: 580, y: 150 }, track2: { x: 620, y: 250 }, position: "NORMAL", locked: false },
  { id: "P202", stationId: "MTJ", track1: { x: 700, y: 150 }, track2: { x: 740, y: 250 }, position: "NORMAL", locked: false },
  { id: "P203", stationId: "MTJ", track1: { x: 580, y: 450 }, track2: { x: 620, y: 350 }, position: "NORMAL", locked: false },
  { id: "P204", stationId: "MTJ", track1: { x: 700, y: 450 }, track2: { x: 740, y: 350 }, position: "NORMAL", locked: false },

  // AGRA CANTT points
  { id: "P301", stationId: "AGC", track1: { x: 1080, y: 150 }, track2: { x: 1120, y: 250 }, position: "NORMAL", locked: false },
  { id: "P302", stationId: "AGC", track1: { x: 1200, y: 150 }, track2: { x: 1240, y: 250 }, position: "NORMAL", locked: false },
  { id: "P303", stationId: "AGC", track1: { x: 1080, y: 450 }, track2: { x: 1120, y: 350 }, position: "NORMAL", locked: false },
  { id: "P304", stationId: "AGC", track1: { x: 1200, y: 450 }, track2: { x: 1240, y: 350 }, position: "NORMAL", locked: false },

  // JHANSI JN points
  { id: "P401", stationId: "JHS", track1: { x: 1580, y: 150 }, track2: { x: 1620, y: 250 }, position: "NORMAL", locked: false },
  { id: "P402", stationId: "JHS", track1: { x: 1700, y: 150 }, track2: { x: 1740, y: 250 }, position: "NORMAL", locked: false },
  { id: "P403", stationId: "JHS", track1: { x: 1580, y: 450 }, track2: { x: 1620, y: 350 }, position: "NORMAL", locked: false },
  { id: "P404", stationId: "JHS", track1: { x: 1700, y: 450 }, track2: { x: 1740, y: 350 }, position: "NORMAL", locked: false },

  // BHOPAL JN points
  { id: "P501", stationId: "BPL", track1: { x: 2080, y: 150 }, track2: { x: 2120, y: 250 }, position: "NORMAL", locked: false },
  { id: "P502", stationId: "BPL", track1: { x: 2200, y: 150 }, track2: { x: 2240, y: 250 }, position: "NORMAL", locked: false },
  { id: "P503", stationId: "BPL", track1: { x: 2080, y: 450 }, track2: { x: 2120, y: 350 }, position: "NORMAL", locked: false },
  { id: "P504", stationId: "BPL", track1: { x: 2200, y: 450 }, track2: { x: 2240, y: 350 }, position: "NORMAL", locked: false },

  // VADODARA JN points
  { id: "P601", stationId: "BRC", track1: { x: 2580, y: 150 }, track2: { x: 2620, y: 250 }, position: "NORMAL", locked: false },
  { id: "P602", stationId: "BRC", track1: { x: 2700, y: 150 }, track2: { x: 2740, y: 250 }, position: "NORMAL", locked: false },
  { id: "P603", stationId: "BRC", track1: { x: 2580, y: 450 }, track2: { x: 2620, y: 350 }, position: "NORMAL", locked: false },
  { id: "P604", stationId: "BRC", track1: { x: 2700, y: 450 }, track2: { x: 2740, y: 350 }, position: "NORMAL", locked: false },

  // MUMBAI CENTRAL points
  { id: "P701", stationId: "MMCT", track1: { x: 3080, y: 150 }, track2: { x: 3120, y: 250 }, position: "NORMAL", locked: false },
  { id: "P702", stationId: "MMCT", track1: { x: 3200, y: 150 }, track2: { x: 3240, y: 250 }, position: "NORMAL", locked: false },
  { id: "P703", stationId: "MMCT", track1: { x: 3080, y: 450 }, track2: { x: 3120, y: 350 }, position: "NORMAL", locked: false },
  { id: "P704", stationId: "MMCT", track1: { x: 3200, y: 450 }, track2: { x: 3240, y: 350 }, position: "NORMAL", locked: false }
];

// Signals guarding track sections
// Aspect: RED (stop), YELLOW (caution), GREEN (proceed), DOUBLE_YELLOW (attention)
export const signals = [
  // NEW DELHI signals
  { id: "S101", stationId: "NDLS", x: 50, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S102", stationId: "NDLS", x: 250, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "starter" },
  { id: "S103", stationId: "NDLS", x: 50, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S104", stationId: "NDLS", x: 250, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "starter" },

  // MATHURA JN signals
  { id: "S201", stationId: "MTJ", x: 550, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S202", stationId: "MTJ", x: 750, y: 150, guarding: "DN_MAIN", aspect: "YELLOW", signalType: "starter" },
  { id: "S203", stationId: "MTJ", x: 550, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S204", stationId: "MTJ", x: 750, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "starter" },

  // AGRA CANTT signals
  { id: "S301", stationId: "AGC", x: 1050, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S302", stationId: "AGC", x: 1250, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "starter" },
  { id: "S303", stationId: "AGC", x: 1050, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S304", stationId: "AGC", x: 1250, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "starter" },

  // JHANSI JN signals
  { id: "S401", stationId: "JHS", x: 1550, y: 150, guarding: "DN_MAIN", aspect: "RED", signalType: "home" },
  { id: "S402", stationId: "JHS", x: 1750, y: 150, guarding: "DN_MAIN", aspect: "RED", signalType: "starter" },
  { id: "S403", stationId: "JHS", x: 1550, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S404", stationId: "JHS", x: 1750, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "starter" },

  // BHOPAL JN signals
  { id: "S501", stationId: "BPL", x: 2050, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S502", stationId: "BPL", x: 2250, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "starter" },
  { id: "S503", stationId: "BPL", x: 2050, y: 450, guarding: "UP_MAIN", aspect: "YELLOW", signalType: "home" },
  { id: "S504", stationId: "BPL", x: 2250, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "starter" },

  // VADODARA JN signals
  { id: "S601", stationId: "BRC", x: 2550, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S602", stationId: "BRC", x: 2750, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "starter" },
  { id: "S603", stationId: "BRC", x: 2550, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S604", stationId: "BRC", x: 2750, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "starter" },

  // MUMBAI CENTRAL signals
  { id: "S701", stationId: "MMCT", x: 3050, y: 150, guarding: "DN_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S702", stationId: "MMCT", x: 3250, y: 150, guarding: "DN_MAIN", aspect: "RED", signalType: "starter" },
  { id: "S703", stationId: "MMCT", x: 3050, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "home" },
  { id: "S704", stationId: "MMCT", x: 3250, y: 450, guarding: "UP_MAIN", aspect: "GREEN", signalType: "starter" }
];

// Track circuits (sections) for train detection
// State: CLEAR, OCCUPIED, FAULT
export const trackCircuits = [
  // Between stations - DN MAIN
  { id: "TC-101", x: 150, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "NDLS", toStation: "MTJ", length: 145 },
  { id: "TC-102", x: 400, y: 130, track: "DN_MAIN", state: "OCCUPIED", fromStation: "NDLS", toStation: "MTJ", length: 145 },
  { id: "TC-201", x: 650, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "MTJ", toStation: "AGC", length: 50 },
  { id: "TC-202", x: 900, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "MTJ", toStation: "AGC", length: 50 },
  { id: "TC-301", x: 1150, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "AGC", toStation: "JHS", length: 208 },
  { id: "TC-302", x: 1400, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "AGC", toStation: "JHS", length: 208 },
  { id: "TC-401", x: 1650, y: 130, track: "DN_MAIN", state: "OCCUPIED", fromStation: "JHS", toStation: "BPL", length: 302 },
  { id: "TC-402", x: 1900, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "JHS", toStation: "BPL", length: 302 },
  { id: "TC-501", x: 2150, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "BPL", toStation: "BRC", length: 389 },
  { id: "TC-502", x: 2400, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "BPL", toStation: "BRC", length: 389 },
  { id: "TC-601", x: 2650, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "BRC", toStation: "MMCT", length: 290 },
  { id: "TC-602", x: 2900, y: 130, track: "DN_MAIN", state: "CLEAR", fromStation: "BRC", toStation: "MMCT", length: 290 },
  { id: "TC-701", x: 3150, y: 130, track: "DN_MAIN", state: "OCCUPIED", fromStation: "BRC", toStation: "MMCT", length: 290 },

  // Between stations - UP MAIN
  { id: "TC-103", x: 150, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "NDLS", toStation: "MTJ", length: 145 },
  { id: "TC-104", x: 400, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "NDLS", toStation: "MTJ", length: 145 },
  { id: "TC-203", x: 650, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "MTJ", toStation: "AGC", length: 50 },
  { id: "TC-204", x: 900, y: 470, track: "UP_MAIN", state: "OCCUPIED", fromStation: "MTJ", toStation: "AGC", length: 50 },
  { id: "TC-303", x: 1150, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "AGC", toStation: "JHS", length: 208 },
  { id: "TC-304", x: 1400, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "AGC", toStation: "JHS", length: 208 },
  { id: "TC-403", x: 1650, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "JHS", toStation: "BPL", length: 302 },
  { id: "TC-404", x: 1900, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "JHS", toStation: "BPL", length: 302 },
  { id: "TC-503", x: 2150, y: 470, track: "UP_MAIN", state: "OCCUPIED", fromStation: "BPL", toStation: "BRC", length: 389 },
  { id: "TC-504", x: 2400, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "BPL", toStation: "BRC", length: 389 },
  { id: "TC-603", x: 2650, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "BRC", toStation: "MMCT", length: 290 },
  { id: "TC-604", x: 2900, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "BRC", toStation: "MMCT", length: 290 },
  { id: "TC-703", x: 3150, y: 470, track: "UP_MAIN", state: "CLEAR", fromStation: "BRC", toStation: "MMCT", length: 290 }
];

// Train movements across the corridor
export const trains = [
  {
    id: "12951",
    name: "Mumbai Rajdhani",
    direction: "DOWN",
    trackCircuit: "TC-102",
    status: "ON TIME",
    x: 400,
    y: 150,
    speed: 130,
    destination: "MMCT"
  },
  {
    id: "12952",
    name: "New Delhi Rajdhani",
    direction: "UP",
    trackCircuit: "TC-503",
    status: "DELAYED +8 MIN",
    x: 2150,
    y: 450,
    speed: 120,
    destination: "NDLS"
  },
  {
    id: "12909",
    name: "Mumbai Garib Rath",
    direction: "DOWN",
    trackCircuit: "TC-401",
    status: "ON TIME",
    x: 1650,
    y: 150,
    speed: 110,
    destination: "MMCT"
  },
  {
    id: "12002",
    name: "Bhopal Shatabdi",
    direction: "UP",
    trackCircuit: "TC-204",
    status: "ON TIME",
    x: 900,
    y: 450,
    speed: 140,
    destination: "NDLS"
  },
  {
    id: "12137",
    name: "Punjab Mail",
    direction: "DOWN",
    trackCircuit: "TC-701",
    status: "APPROACHING",
    x: 3150,
    y: 150,
    speed: 100,
    destination: "MMCT"
  }
];

// Station buildings and platforms for visual representation
export const stationInfrastructure = stations.map(station => ({
  stationId: station.id,
  building: {
    x: station.x - 40,
    y: 50,
    width: 80,
    height: 30,
    label: station.name
  },
  platforms: [
    { id: `${station.id}-PF1`, x: station.x - 60, y: 180, width: 120, height: 15, number: 1, track: "DN_MAIN" },
    { id: `${station.id}-PF2`, x: station.x - 60, y: 405, width: 120, height: 15, number: 2, track: "UP_MAIN" }
  ]
}));

// Track section boundaries for maintenance planning
export const trackSections = [
  { id: "SEC-NDLS-MTJ-DN", fromStation: "NDLS", toStation: "MTJ", track: "DN_MAIN", x1: 250, x2: 550, y: 150 },
  { id: "SEC-NDLS-MTJ-UP", fromStation: "NDLS", toStation: "MTJ", track: "UP_MAIN", x1: 250, x2: 550, y: 450 },
  { id: "SEC-MTJ-AGC-DN", fromStation: "MTJ", toStation: "AGC", track: "DN_MAIN", x1: 750, x2: 1050, y: 150 },
  { id: "SEC-MTJ-AGC-UP", fromStation: "MTJ", toStation: "AGC", track: "UP_MAIN", x1: 750, x2: 1050, y: 450 },
  { id: "SEC-AGC-JHS-DN", fromStation: "AGC", toStation: "JHS", track: "DN_MAIN", x1: 1250, x2: 1550, y: 150 },
  { id: "SEC-AGC-JHS-UP", fromStation: "AGC", toStation: "JHS", track: "UP_MAIN", x1: 1250, x2: 1550, y: 450 },
  { id: "SEC-JHS-BPL-DN", fromStation: "JHS", toStation: "BPL", track: "DN_MAIN", x1: 1750, x2: 2050, y: 150 },
  { id: "SEC-JHS-BPL-UP", fromStation: "JHS", toStation: "BPL", track: "UP_MAIN", x1: 1750, x2: 2050, y: 450 },
  { id: "SEC-BPL-BRC-DN", fromStation: "BPL", toStation: "BRC", track: "DN_MAIN", x1: 2250, x2: 2550, y: 150 },
  { id: "SEC-BPL-BRC-UP", fromStation: "BPL", toStation: "BRC", track: "UP_MAIN", x1: 2250, x2: 2550, y: 450 },
  { id: "SEC-BRC-MMCT-DN", fromStation: "BRC", toStation: "MMCT", track: "DN_MAIN", x1: 2750, x2: 3050, y: 150 },
  { id: "SEC-BRC-MMCT-UP", fromStation: "BRC", toStation: "MMCT", track: "UP_MAIN", x1: 2750, x2: 3050, y: 450 }
];

// Demo route data for interlocking simulation
export const routes = [
  {
    id: "R-NDLS-1",
    fromSignal: "S101",
    toSignal: "S102",
    stationId: "NDLS",
    requiredPositions: { P101: "NORMAL", P102: "NORMAL" },
    affectedPoints: ["P101", "P102"],
    track: "DN_MAIN"
  },
  {
    id: "R-MTJ-1",
    fromSignal: "S201",
    toSignal: "S202",
    stationId: "MTJ",
    requiredPositions: { P201: "NORMAL", P202: "NORMAL" },
    affectedPoints: ["P201", "P202"],
    track: "DN_MAIN"
  },
  {
    id: "R-JHS-1",
    fromSignal: "S401",
    toSignal: "S402",
    stationId: "JHS",
    requiredPositions: { P401: "REVERSE", P402: "REVERSE" },
    affectedPoints: ["P401", "P402"],
    track: "DN_MAIN"
  }
];

// Export comprehensive corridor configuration
export const delhiMumbaiCorridor = {
  name: "Delhi-Mumbai Corridor",
  code: "DMC-01",
  totalLength: 1384, // km
  stations,
  tracks,
  points,
  signals,
  trackCircuits,
  trains,
  stationInfrastructure,
  trackSections,
  routes
};

export default delhiMumbaiCorridor;
