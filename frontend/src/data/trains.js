/**
 * Mock Data: Passenger & Freight Trains
 */

export const PASSENGER_TRAINS = [
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
    delay: 0,
    eta: '10:05',
    speed: '128 km/h',
    lastUpdated: '09:47:32',
    routeSection: 'Section A-B (AGC - NDLS)',
    platform: 'PF 2',
    coordinates: { x: 74, y: 38 }, // Percentage coordinates for railway schematic map
    stops: [
      { station: 'Bhopal Jn', scheduled: '05:30', status: 'Departed' },
      { station: 'Gwalior', scheduled: '07:45', status: 'Departed' },
      { station: 'Agra Cantt', scheduled: '09:12', status: 'Departed' },
      { station: 'Mathura Jn', scheduled: '09:45', status: 'Passed' },
      { station: 'New Delhi', scheduled: '10:05', status: 'Approaching' }
    ]
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
    delay: 0,
    eta: '10:05',
    speed: '130 km/h',
    lastUpdated: '09:45:10',
    routeSection: 'Section B-C (KOTA - MTJ)',
    platform: 'PF 4',
    coordinates: { x: 52, y: 55 },
    stops: [
      { station: 'Mumbai Central', scheduled: '17:00', status: 'Departed' },
      { station: 'Vadodara', scheduled: '21:30', status: 'Departed' },
      { station: 'Kota Jn', scheduled: '03:15', status: 'Departed' },
      { station: 'Mathura Jn', scheduled: '08:40', status: 'Passed' },
      { station: 'New Delhi', scheduled: '10:05', status: 'In Transit' }
    ]
  },
  {
    id: '12310',
    number: '12310',
    name: 'Rajdhani Express',
    type: 'PASSENGER',
    category: 'Rajdhani Express',
    source: 'New Delhi (NDLS)',
    destination: 'Howrah Jn (HWH)',
    currentStation: 'Ghaziabad Jn (GZB)',
    nextStation: 'Kanpur Central (CNB)',
    status: 'DELAYED 12 MIN',
    delay: 12,
    eta: '10:42',
    speed: '110 km/h',
    lastUpdated: '09:46:18',
    routeSection: 'Section A-C (GZB - CNB)',
    platform: 'PF 3',
    coordinates: { x: 82, y: 28 },
    stops: [
      { station: 'New Delhi', scheduled: '10:30', status: 'Boarding' },
      { station: 'Ghaziabad', scheduled: '10:55', status: 'Scheduled' },
      { station: 'Kanpur Central', scheduled: '14:40', status: 'Scheduled' },
      { station: 'Prayagraj', scheduled: '17:10', status: 'Scheduled' },
      { station: 'Howrah Jn', scheduled: '04:55', status: 'Scheduled' }
    ]
  },
  {
    id: '22436',
    number: '22436',
    name: 'Vande Bharat Express',
    type: 'PASSENGER',
    category: 'Vande Bharat',
    source: 'New Delhi (NDLS)',
    destination: 'Varanasi Jn (BSB)',
    currentStation: 'Aligarh Jn (ALJN)',
    nextStation: 'Kanpur Central (CNB)',
    status: 'ON TIME',
    delay: 0,
    eta: '11:20',
    speed: '140 km/h',
    lastUpdated: '09:48:02',
    routeSection: 'Section A-C (ALJN - CNB)',
    platform: 'PF 1',
    coordinates: { x: 62, y: 32 },
    stops: [
      { station: 'New Delhi', scheduled: '06:00', status: 'Departed' },
      { station: 'Kanpur Central', scheduled: '10:10', status: 'Approaching' },
      { station: 'Prayagraj', scheduled: '12:15', status: 'Scheduled' },
      { station: 'Varanasi', scheduled: '14:00', status: 'Scheduled' }
    ]
  }
];

export const FREIGHT_TRAINS = [
  {
    id: '70521',
    number: 'FREIGHT 70521',
    name: 'Dedicated Coal Container (BOXN-HL)',
    type: 'CARGO',
    category: 'Heavy Freight',
    source: 'Singrauli (SGRL)',
    destination: 'Dadri Power Plant (DER)',
    currentStation: 'Mathura (MTJ)',
    nextStation: 'New Delhi (NDLS)',
    status: 'ON TIME',
    delay: 0,
    eta: '11:45',
    speed: '75 km/h',
    lastUpdated: '09:47:32',
    routeSection: 'Section A-B (MTJ - NDLS)',
    platform: 'Goods Line 2',
    tonnage: '4,850 MT',
    wagons: 58,
    priority: 'High Corridor Freight',
    coordinates: { x: 68, y: 44 },
    stops: [
      { station: 'Singrauli', scheduled: '22:00', status: 'Departed' },
      { station: 'Agra Yard', scheduled: '08:15', status: 'Departed' },
      { station: 'Mathura', scheduled: '09:30', status: 'Passed' },
      { station: 'Palwal', scheduled: '10:45', status: 'In Transit' },
      { station: 'Dadri DFC', scheduled: '12:00', status: 'Scheduled' }
    ]
  },
  {
    id: '88104',
    number: 'FREIGHT 88104',
    name: 'Automobile Carrier (BCACBM)',
    type: 'CARGO',
    category: 'Automotive Freight',
    source: 'Farukhnagar (FN)',
    destination: 'Bengaluru (SBC)',
    currentStation: 'Palwal (PWL)',
    nextStation: 'Agra Cantt (AGC)',
    status: 'ON TIME',
    delay: 0,
    eta: '12:30',
    speed: '82 km/h',
    lastUpdated: '09:44:20',
    routeSection: 'Section A-B (PWL - AGC)',
    platform: 'Through Line',
    tonnage: '2,200 MT',
    wagons: 45,
    priority: 'Express Cargo',
    coordinates: { x: 45, y: 48 },
    stops: [
      { station: 'Farukhnagar', scheduled: '07:30', status: 'Departed' },
      { station: 'Palwal', scheduled: '09:20', status: 'Departed' },
      { station: 'Agra Cantt', scheduled: '11:10', status: 'In Transit' },
      { station: 'Gwalior', scheduled: '13:40', status: 'Scheduled' }
    ]
  },
  {
    id: '90342',
    number: 'FREIGHT 90342',
    name: 'Petroleum Tanker Rake (BTPN)',
    type: 'CARGO',
    category: 'POL Special',
    source: 'Mathura Refinery (MTJ)',
    destination: 'Jalandhar City (JUC)',
    currentStation: 'Tughlakabad Yard (TKD)',
    nextStation: 'Panipat Jn (PNP)',
    status: 'DELAYED 15 MIN',
    delay: 15,
    eta: '13:10',
    speed: '65 km/h',
    lastUpdated: '09:42:15',
    routeSection: 'Section A-D (TKD - PNP)',
    platform: 'TKD Departure 4',
    tonnage: '3,600 MT',
    wagons: 50,
    priority: 'Hazardous Cargo Priority',
    coordinates: { x: 30, y: 62 },
    stops: [
      { station: 'Mathura Refinery', scheduled: '06:00', status: 'Departed' },
      { station: 'Tughlakabad Yard', scheduled: '09:10', status: 'Holding' },
      { station: 'Panipat', scheduled: '12:45', status: 'Scheduled' },
      { station: 'Jalandhar City', scheduled: '18:30', status: 'Scheduled' }
    ]
  }
];
