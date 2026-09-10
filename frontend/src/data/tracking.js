/**
 * Mock Data: Live Railway Corridors and Tracking Metrics
 */

export const CORRIDORS = [
  {
    id: 'corridor-main',
    name: 'Delhi - Mumbai / Howrah Trunk Corridor',
    sections: ['Section A-B (Agra - Delhi)', 'Section B-C (Kota - Mathura)', 'Section A-C (Ghaziabad - Kanpur)'],
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

export const TRACKING_METRICS = {
  totalMonitored: 124,
  onTime: 118,
  delayed: 6,
  corridorsActive: 5,
  freightInTransit: 38,
  passengerInTransit: 86,
  averageNetworkSpeed: '94.2 km/h',
  criticalAlerts: 1
};
