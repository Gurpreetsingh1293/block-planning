/**
 * Maintenance Section Data Model
 * 
 * Defines maintenance tasks, sections, their statuses, and associated details
 * for the Delhi-Mumbai corridor S&T operations.
 */

// Maintenance status color scheme
export const maintenanceStatusColors = {
  clear: {
    fill: "rgba(0, 200, 81, 0.1)",
    stroke: "#00c851",
    label: "Clear",
    priority: 0
  },
  scheduled: {
    fill: "rgba(74, 158, 255, 0.15)",
    stroke: "#4a9eff",
    label: "Scheduled",
    priority: 1
  },
  inProgress: {
    fill: "rgba(255, 165, 0, 0.15)",
    stroke: "#ffa500",
    label: "In Progress",
    priority: 2
  },
  overdue: {
    fill: "rgba(255, 51, 51, 0.15)",
    stroke: "#ff3333",
    label: "Overdue",
    priority: 3
  },
  blocked: {
    fill: "rgba(139, 0, 0, 0.2)",
    stroke: "#8b0000",
    label: "Blocked",
    priority: 4
  }
};

// Task type categories
export const taskTypes = {
  signal: {
    id: "signal",
    label: "Signal Maintenance",
    icon: "🚦",
    color: "#4a9eff"
  },
  track: {
    id: "track",
    label: "Track Circuit Maintenance",
    icon: "⚡",
    color: "#ffa500"
  },
  point: {
    id: "point",
    label: "Point Machine Maintenance",
    icon: "⚙️",
    color: "#00c851"
  },
  telecom: {
    id: "telecom",
    label: "Telecommunication",
    icon: "📡",
    color: "#00d4ff"
  },
  electrical: {
    id: "electrical",
    label: "Electrical Systems",
    icon: "⚡",
    color: "#ffbb33"
  },
  interlocking: {
    id: "interlocking",
    label: "Interlocking System",
    icon: "🔒",
    color: "#ff3333"
  }
};

// Urgency levels
export const urgencyLevels = {
  low: { label: "Low", color: "#00c851", priority: 1 },
  medium: { label: "Medium", color: "#ffa500", priority: 2 },
  high: { label: "High", color: "#ff3333", priority: 3 },
  critical: { label: "Critical", color: "#8b0000", priority: 4 }
};

// Maintenance tasks with comprehensive details
export const maintenanceTasks = [
  // NEW DELHI Station Tasks
  {
    id: "MAINT-001",
    sectionId: "SEC-NDLS-MTJ-DN",
    trackSectionId: "SEC-NDLS-MTJ-DN",
    status: "scheduled",
    taskType: "signal",
    asset: "Signal S102",
    assetId: "S102",
    location: "New Delhi Jn - KM 2.5",
    stationId: "NDLS",
    urgency: "medium",
    requiredDuration: "3 hours",
    manpower: "2 technicians + 1 supervisor",
    recommendedWindow: "2026-09-11 02:00 - 05:00",
    description: "LED aspect replacement and alignment check",
    affectedTracks: ["DN_MAIN"],
    requiredBlockPath: ["P101", "P102", "S101", "S102"],
    estimatedCost: "₹15,000",
    lastMaintenance: "2026-06-10",
    nextDue: "2026-09-15"
  },
  {
    id: "MAINT-002",
    sectionId: "SEC-NDLS-MTJ-UP",
    trackSectionId: "SEC-NDLS-MTJ-UP",
    status: "inProgress",
    taskType: "track",
    asset: "Track Circuit TC-103",
    assetId: "TC-103",
    location: "New Delhi - Mathura Section - KM 25",
    stationId: "NDLS",
    urgency: "high",
    requiredDuration: "4 hours",
    manpower: "3 technicians",
    recommendedWindow: "2026-09-10 22:00 - 02:00",
    description: "Track circuit relay replacement due to intermittent faults",
    affectedTracks: ["UP_MAIN"],
    requiredBlockPath: ["P103", "P104", "S103", "S104"],
    estimatedCost: "₹25,000",
    lastMaintenance: "2026-03-15",
    nextDue: "2026-09-12",
    workStarted: "2026-09-10 22:30"
  },

  // MATHURA JN Station Tasks
  {
    id: "MAINT-003",
    sectionId: "SEC-MTJ-AGC-DN",
    trackSectionId: "SEC-MTJ-AGC-DN",
    status: "scheduled",
    taskType: "point",
    asset: "Point Machine P201",
    assetId: "P201",
    location: "Mathura Jn - Entry Point",
    stationId: "MTJ",
    urgency: "medium",
    requiredDuration: "5 hours",
    manpower: "4 technicians + 1 supervisor",
    recommendedWindow: "2026-09-12 01:00 - 06:00",
    description: "Point machine motor overhaul and lubrication",
    affectedTracks: ["DN_MAIN"],
    requiredBlockPath: ["P201", "P202", "S201", "S202"],
    estimatedCost: "₹40,000",
    lastMaintenance: "2025-12-20",
    nextDue: "2026-09-20"
  },
  {
    id: "MAINT-004",
    sectionId: "SEC-MTJ-AGC-UP",
    trackSectionId: "SEC-MTJ-AGC-UP",
    status: "clear",
    taskType: "signal",
    asset: "Signal S204",
    assetId: "S204",
    location: "Mathura Jn - Starter Signal",
    stationId: "MTJ",
    urgency: "low",
    requiredDuration: "2 hours",
    manpower: "2 technicians",
    recommendedWindow: "2026-09-15 03:00 - 05:00",
    description: "Preventive maintenance and cable inspection",
    affectedTracks: ["UP_MAIN"],
    requiredBlockPath: ["P203", "P204", "S203", "S204"],
    estimatedCost: "₹8,000",
    lastMaintenance: "2026-07-10",
    nextDue: "2026-10-10"
  },

  // AGRA CANTT Station Tasks
  {
    id: "MAINT-005",
    sectionId: "SEC-AGC-JHS-DN",
    trackSectionId: "SEC-AGC-JHS-DN",
    status: "overdue",
    taskType: "telecom",
    asset: "Communication Cable Junction",
    assetId: "COMM-AGC-01",
    location: "Agra Cantt - KM 195.5",
    stationId: "AGC",
    urgency: "high",
    requiredDuration: "6 hours",
    manpower: "3 telecom technicians",
    recommendedWindow: "2026-09-11 00:00 - 06:00",
    description: "Fiber optic cable repair and junction box replacement",
    affectedTracks: ["DN_MAIN"],
    requiredBlockPath: ["P301", "P302", "S301", "S302"],
    estimatedCost: "₹55,000",
    lastMaintenance: "2025-11-05",
    nextDue: "2026-09-05",
    overdueBy: "5 days"
  },
  {
    id: "MAINT-006",
    sectionId: "SEC-AGC-JHS-UP",
    trackSectionId: "SEC-AGC-JHS-UP",
    status: "scheduled",
    taskType: "track",
    asset: "Track Circuit TC-303",
    assetId: "TC-303",
    location: "Agra - Jhansi Section - KM 210",
    stationId: "AGC",
    urgency: "medium",
    requiredDuration: "3 hours",
    manpower: "3 technicians",
    recommendedWindow: "2026-09-13 02:00 - 05:00",
    description: "Track circuit adjustment and insulation testing",
    affectedTracks: ["UP_MAIN"],
    requiredBlockPath: ["P303", "P304", "S303", "S304"],
    estimatedCost: "₹18,000",
    lastMaintenance: "2026-05-20",
    nextDue: "2026-09-18"
  },

  // JHANSI JN Station Tasks
  {
    id: "MAINT-007",
    sectionId: "SEC-JHS-BPL-DN",
    trackSectionId: "SEC-JHS-BPL-DN",
    status: "blocked",
    taskType: "interlocking",
    asset: "Interlocking Panel - Zone A",
    assetId: "IXL-JHS-A",
    location: "Jhansi Jn - Control Room",
    stationId: "JHS",
    urgency: "critical",
    requiredDuration: "8 hours",
    manpower: "5 technicians + 2 supervisors",
    recommendedWindow: "2026-09-11 00:00 - 08:00",
    description: "Emergency interlocking relay replacement and system testing",
    affectedTracks: ["DN_MAIN"],
    requiredBlockPath: ["P401", "P402", "S401", "S402"],
    estimatedCost: "₹120,000",
    lastMaintenance: "2026-01-15",
    nextDue: "2026-09-08",
    blockedReason: "Awaiting spare parts from depot",
    overdueBy: "2 days"
  },
  {
    id: "MAINT-008",
    sectionId: "SEC-JHS-BPL-UP",
    trackSectionId: "SEC-JHS-BPL-UP",
    status: "scheduled",
    taskType: "point",
    asset: "Point Machine P403",
    assetId: "P403",
    location: "Jhansi Jn - Platform 3",
    stationId: "JHS",
    urgency: "medium",
    requiredDuration: "4 hours",
    manpower: "3 technicians",
    recommendedWindow: "2026-09-14 01:30 - 05:30",
    description: "Point detection system calibration",
    affectedTracks: ["UP_MAIN"],
    requiredBlockPath: ["P403", "P404", "S403", "S404"],
    estimatedCost: "₹22,000",
    lastMaintenance: "2026-04-10",
    nextDue: "2026-09-25"
  },

  // BHOPAL JN Station Tasks
  {
    id: "MAINT-009",
    sectionId: "SEC-BPL-BRC-DN",
    trackSectionId: "SEC-BPL-BRC-DN",
    status: "scheduled",
    taskType: "signal",
    asset: "Signal S502",
    assetId: "S502",
    location: "Bhopal Jn - DN Starter",
    stationId: "BPL",
    urgency: "low",
    requiredDuration: "2.5 hours",
    manpower: "2 technicians",
    recommendedWindow: "2026-09-16 03:00 - 05:30",
    description: "Aspect glass cleaning and LED board inspection",
    affectedTracks: ["DN_MAIN"],
    requiredBlockPath: ["P501", "P502", "S501", "S502"],
    estimatedCost: "₹10,000",
    lastMaintenance: "2026-06-15",
    nextDue: "2026-09-20"
  },
  {
    id: "MAINT-010",
    sectionId: "SEC-BPL-BRC-UP",
    trackSectionId: "SEC-BPL-BRC-UP",
    status: "inProgress",
    taskType: "electrical",
    asset: "Power Supply Unit - PSU-BPL-02",
    assetId: "PSU-BPL-02",
    location: "Bhopal Jn - S&T Equipment Room",
    stationId: "BPL",
    urgency: "high",
    requiredDuration: "5 hours",
    manpower: "3 electrical technicians + 1 supervisor",
    recommendedWindow: "2026-09-10 21:00 - 02:00",
    description: "UPS battery replacement and load testing",
    affectedTracks: ["UP_MAIN"],
    requiredBlockPath: ["P503", "P504", "S503", "S504"],
    estimatedCost: "₹85,000",
    lastMaintenance: "2025-09-10",
    nextDue: "2026-09-12",
    workStarted: "2026-09-10 21:15"
  },

  // VADODARA JN Station Tasks
  {
    id: "MAINT-011",
    sectionId: "SEC-BRC-MMCT-DN",
    trackSectionId: "SEC-BRC-MMCT-DN",
    status: "scheduled",
    taskType: "track",
    asset: "Track Circuit TC-602",
    assetId: "TC-602",
    location: "Vadodara - Mumbai Section - KM 1150",
    stationId: "BRC",
    urgency: "medium",
    requiredDuration: "4 hours",
    manpower: "3 technicians",
    recommendedWindow: "2026-09-15 01:00 - 05:00",
    description: "Track circuit insulation improvement and bonding check",
    affectedTracks: ["DN_MAIN"],
    requiredBlockPath: ["P601", "P602", "S601", "S602"],
    estimatedCost: "₹28,000",
    lastMaintenance: "2026-04-20",
    nextDue: "2026-09-22"
  },
  {
    id: "MAINT-012",
    sectionId: "SEC-BRC-MMCT-UP",
    trackSectionId: "SEC-BRC-MMCT-UP",
    status: "clear",
    taskType: "point",
    asset: "Point Machine P604",
    assetId: "P604",
    location: "Vadodara Jn - Reception Point",
    stationId: "BRC",
    urgency: "low",
    requiredDuration: "3 hours",
    manpower: "2 technicians",
    recommendedWindow: "2026-09-18 02:30 - 05:30",
    description: "Routine point machine lubrication and inspection",
    affectedTracks: ["UP_MAIN"],
    requiredBlockPath: ["P603", "P604", "S603", "S604"],
    estimatedCost: "₹12,000",
    lastMaintenance: "2026-07-01",
    nextDue: "2026-10-01"
  }
];

// Track section maintenance status mapping
export const trackSectionStatus = maintenanceTasks.reduce((acc, task) => {
  acc[task.trackSectionId] = {
    status: task.status,
    taskId: task.id,
    urgency: task.urgency
  };
  return acc;
}, {});

// Helper functions for maintenance data manipulation
export const maintenanceHelpers = {
  // Get tasks by status
  getTasksByStatus: (status) => {
    return maintenanceTasks.filter(task => task.status === status);
  },

  // Get tasks by station
  getTasksByStation: (stationId) => {
    return maintenanceTasks.filter(task => task.stationId === stationId);
  },

  // Get tasks by urgency
  getTasksByUrgency: (urgency) => {
    return maintenanceTasks.filter(task => task.urgency === urgency);
  },

  // Get tasks by task type
  getTasksByType: (taskType) => {
    return maintenanceTasks.filter(task => task.taskType === taskType);
  },

  // Get task by ID
  getTaskById: (taskId) => {
    return maintenanceTasks.find(task => task.id === taskId);
  },

  // Get status counts
  getStatusCounts: () => {
    return maintenanceTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  },

  // Get overdue tasks
  getOverdueTasks: () => {
    return maintenanceTasks.filter(task => task.status === 'overdue' || task.overdueBy);
  },

  // Get critical tasks
  getCriticalTasks: () => {
    return maintenanceTasks.filter(task => task.urgency === 'critical' || task.status === 'blocked');
  },

  // Get tasks requiring block in next 48 hours
  getUpcomingTasks: () => {
    // In a real app, this would parse recommendedWindow dates
    return maintenanceTasks.filter(task => 
      task.status === 'scheduled' && 
      (task.urgency === 'high' || task.urgency === 'critical')
    );
  },

  // Calculate combined block path from multiple tasks
  getCombinedBlockPath: (taskIds) => {
    const tasks = taskIds.map(id => maintenanceHelpers.getTaskById(id)).filter(Boolean);
    const allBlockElements = tasks.flatMap(task => task.requiredBlockPath || []);
    return [...new Set(allBlockElements)]; // Remove duplicates
  },

  // Get affected tracks from multiple tasks
  getCombinedAffectedTracks: (taskIds) => {
    const tasks = taskIds.map(id => maintenanceHelpers.getTaskById(id)).filter(Boolean);
    const allTracks = tasks.flatMap(task => task.affectedTracks || []);
    return [...new Set(allTracks)];
  }
};

// Export default maintenance configuration
export const maintenanceConfig = {
  tasks: maintenanceTasks,
  statusColors: maintenanceStatusColors,
  taskTypes,
  urgencyLevels,
  trackSectionStatus,
  helpers: maintenanceHelpers
};

export default maintenanceConfig;
