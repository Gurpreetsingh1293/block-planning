/**
 * Train Service Layer
 * Connects to /api/trains endpoints with reliable mock data fallback
 */
import { PASSENGER_TRAINS, FREIGHT_TRAINS } from '../data/trains';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://block-planning-backend.onrender.com' : '');

export async function getTrains(type = 'ALL') {
  try {
    const res = await fetch(`${BASE_URL}/api/trains/search?type=${encodeURIComponent(type)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.trains && data.trains.length > 0) return data.trains;
    }
  } catch (err) {
    console.warn('[trainService] Backend unavailable, using local mock trains:', err.message);
  }

  // Fallback to local mock data
  if (type === 'PASSENGER') return PASSENGER_TRAINS;
  if (type === 'CARGO') return FREIGHT_TRAINS;
  return [...PASSENGER_TRAINS, ...FREIGHT_TRAINS];
}

export async function getTrainById(trainId) {
  try {
    const res = await fetch(`${BASE_URL}/api/trains/${encodeURIComponent(trainId)}/live`);
    if (res.ok) {
      const data = await res.json();
      if (data.train) return data.train;
    }
  } catch (err) {
    console.warn('[trainService] Backend live train fetch failed:', err.message);
  }

  const all = [...PASSENGER_TRAINS, ...FREIGHT_TRAINS];
  const found = all.find((t) => t.id === trainId || t.number.includes(trainId));
  return found || null;
}

export async function searchTrains(query, type = 'ALL') {
  try {
    const url = `${BASE_URL}/api/trains/search?q=${encodeURIComponent(query || '')}&type=${encodeURIComponent(type)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.trains && data.trains.length > 0) return data.trains;
    }
  } catch (err) {
    console.warn('[trainService] Backend search unavailable, using local search:', err.message);
  }

  const list = await getTrains(type);
  if (!query || query.trim() === '') return list;
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(Boolean);
  return list.filter((t) => {
    const full = `${t.number || ''} ${t.name || ''} ${t.source || ''} ${t.destination || ''} ${t.currentStation || ''}`.toLowerCase();
    return words.every((w) => full.includes(w)) || full.includes(q);
  });
}

export async function getLiveTrainStatus(trainNumber, date = null) {
  try {
    const url = date
      ? `${BASE_URL}/api/trains/${encodeURIComponent(trainNumber)}/live?date=${encodeURIComponent(date)}`
      : `${BASE_URL}/api/trains/${encodeURIComponent(trainNumber)}/live`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[trainService] getLiveTrainStatus failed:', err.message);
  }

  const all = [...PASSENGER_TRAINS, ...FREIGHT_TRAINS];
  const found = all.find((t) => t.number.includes(trainNumber));
  const fallbackRoute = MOCK_ROUTES[trainNumber] || MOCK_ROUTES['12002'];
  const fallbackCoords = fallbackRoute?.polyline?.[Math.floor(fallbackRoute.polyline.length / 2)] || [77.2090, 28.6139];

  return {
    success: true,
    train: found ? {
      ...found,
      coordinates: {
        lat: fallbackCoords[1],
        lng: fallbackCoords[0]
      },
      bearing: 155
    } : null,
    telemetry: found ? {
      speedKmh: typeof found.speed === 'number' ? found.speed : (parseInt(found.speed, 10) || 95),
      delayMinutes: found.delay || 0,
      currentStation: found.currentStation,
      nextStation: found.nextStation,
      etaNextStation: found.eta || '14:20',
      lastUpdated: new Date().toISOString()
    } : null
  };
}

// Client-side fallback routes for resilient offline / standalone rendering
const MOCK_ROUTES = {
  '12002': {
    trainNumber: '12002',
    trainName: 'New Delhi - Rani Kamlapati (Bhopal) Shatabdi Express',
    stations: [
      { code: 'NDLS', name: 'New Delhi', latitude: 28.6429, longitude: 77.2195, scheduledDeparture: '06:00', actualDeparture: '06:01', delayMinutes: 1, distanceFromSourceKm: 0, platform: '1' },
      { code: 'MTJ', name: 'Mathura Junction', latitude: 27.4924, longitude: 77.6737, scheduledArrival: '07:19', scheduledDeparture: '07:20', actualArrival: '07:20', actualDeparture: '07:21', delayMinutes: 1, distanceFromSourceKm: 141, platform: '1' },
      { code: 'AGC', name: 'Agra Cantt', latitude: 27.1585, longitude: 77.9904, scheduledArrival: '07:50', scheduledDeparture: '07:55', actualArrival: '07:52', actualDeparture: '07:57', delayMinutes: 2, distanceFromSourceKm: 195, platform: '1' },
      { code: 'GWL', name: 'Gwalior Junction', latitude: 26.2166, longitude: 78.1818, scheduledArrival: '09:23', scheduledDeparture: '09:28', actualArrival: '09:25', actualDeparture: '09:30', delayMinutes: 2, distanceFromSourceKm: 313, platform: '1' },
      { code: 'VGLJ', name: 'VGL Jhansi Junction', latitude: 25.4484, longitude: 78.5685, scheduledArrival: '10:45', scheduledDeparture: '10:50', actualArrival: '10:48', actualDeparture: '10:53', delayMinutes: 3, distanceFromSourceKm: 410, platform: '1' },
      { code: 'BPL', name: 'Bhopal Junction', latitude: 23.2599, longitude: 77.4126, scheduledArrival: '14:07', scheduledDeparture: '14:12', actualArrival: '14:10', actualDeparture: '14:15', delayMinutes: 3, distanceFromSourceKm: 702, platform: '1' },
      { code: 'RKMP', name: 'Rani Kamlapati', latitude: 23.2185, longitude: 77.4422, scheduledArrival: '14:40', expectedArrival: '14:42', delayMinutes: 2, distanceFromSourceKm: 708, platform: '1' }
    ],
    polyline: [
      [77.2195, 28.6429], [77.4500, 28.0000], [77.6737, 27.4924], [77.9904, 27.1585],
      [78.1818, 26.2166], [78.5685, 25.4484], [78.4000, 24.3000], [77.4126, 23.2599],
      [77.4422, 23.2185]
    ]
  },
  '12951': {
    trainNumber: '12951',
    trainName: 'Mumbai Central - New Delhi Tejas Rajdhani Express',
    stations: [
      { code: 'MMCT', name: 'Mumbai Central', latitude: 18.9696, longitude: 72.8193, scheduledDeparture: '17:00', actualDeparture: '17:02', delayMinutes: 2, distanceFromSourceKm: 0, platform: '1' },
      { code: 'BVI', name: 'Borivali', latitude: 19.2291, longitude: 72.8574, scheduledArrival: '17:22', scheduledDeparture: '17:24', actualArrival: '17:25', actualDeparture: '17:27', delayMinutes: 3, distanceFromSourceKm: 30, platform: '6' },
      { code: 'ST', name: 'Surat', latitude: 21.2049, longitude: 72.8406, scheduledArrival: '19:43', scheduledDeparture: '19:48', actualArrival: '19:45', actualDeparture: '19:50', delayMinutes: 2, distanceFromSourceKm: 263, platform: '1' },
      { code: 'BRC', name: 'Vadodara Junction', latitude: 22.3107, longitude: 73.1812, scheduledArrival: '21:06', scheduledDeparture: '21:16', actualArrival: '21:10', actualDeparture: '21:20', delayMinutes: 4, distanceFromSourceKm: 392, platform: '2' },
      { code: 'RTM', name: 'Ratlam Junction', latitude: 23.3441, longitude: 75.0352, scheduledArrival: '00:25', scheduledDeparture: '00:28', actualArrival: '00:28', actualDeparture: '00:31', delayMinutes: 3, distanceFromSourceKm: 653, platform: '5' },
      { code: 'KOTA', name: 'Kota Junction', latitude: 25.2233, longitude: 75.8672, scheduledArrival: '03:15', scheduledDeparture: '03:20', actualArrival: '03:18', actualDeparture: '03:23', delayMinutes: 3, distanceFromSourceKm: 920, platform: '1' },
      { code: 'NZM', name: 'Hazrat Nizamuddin', latitude: 28.5888, longitude: 77.2536, scheduledArrival: '07:55', scheduledDeparture: '07:57', expectedArrival: '07:58', expectedDeparture: '08:00', delayMinutes: 3, distanceFromSourceKm: 1379, platform: '4' },
      { code: 'NDLS', name: 'New Delhi', latitude: 28.6429, longitude: 77.2195, scheduledArrival: '08:32', expectedArrival: '08:35', delayMinutes: 3, distanceFromSourceKm: 1386, platform: '16' }
    ],
    polyline: [
      [72.8193, 18.9696], [72.8350, 19.0500], [72.8574, 19.2291], [72.8600, 19.5000],
      [72.8400, 20.0000], [72.8406, 21.2049], [73.0000, 21.8000], [73.1812, 22.3107],
      [74.0000, 22.8000], [75.0352, 23.3441], [75.5000, 24.2000], [75.8672, 25.2233],
      [76.3000, 26.0000], [76.8000, 26.8000], [77.2536, 28.5888], [77.2195, 28.6429]
    ]
  },
  '12952': {
    trainNumber: '12952',
    trainName: 'New Delhi - Mumbai Central Tejas Rajdhani Express',
    stations: [
      { code: 'NDLS', name: 'New Delhi', latitude: 28.6429, longitude: 77.2195, scheduledDeparture: '16:55', actualDeparture: '16:55', delayMinutes: 0, distanceFromSourceKm: 0, platform: '1' },
      { code: 'KOTA', name: 'Kota Junction', latitude: 25.2233, longitude: 75.8672, scheduledArrival: '21:30', scheduledDeparture: '21:40', actualArrival: '21:35', actualDeparture: '21:45', delayMinutes: 5, distanceFromSourceKm: 466, platform: '1' },
      { code: 'RTM', name: 'Ratlam Junction', latitude: 23.3441, longitude: 75.0352, scheduledArrival: '00:20', scheduledDeparture: '00:23', actualArrival: '00:25', actualDeparture: '00:28', delayMinutes: 5, distanceFromSourceKm: 733, platform: '4' },
      { code: 'BRC', name: 'Vadodara Junction', latitude: 22.3107, longitude: 73.1812, scheduledArrival: '03:40', scheduledDeparture: '03:50', actualArrival: '03:45', actualDeparture: '03:55', delayMinutes: 5, distanceFromSourceKm: 994, platform: '1' },
      { code: 'ST', name: 'Surat', latitude: 21.2049, longitude: 72.8406, scheduledArrival: '05:10', scheduledDeparture: '05:15', actualArrival: '05:15', actualDeparture: '05:20', delayMinutes: 5, distanceFromSourceKm: 1123, platform: '2' },
      { code: 'MMCT', name: 'Mumbai Central', latitude: 18.9696, longitude: 72.8193, scheduledArrival: '08:35', expectedArrival: '08:40', delayMinutes: 5, distanceFromSourceKm: 1386, platform: '1' }
    ],
    polyline: [
      [77.2195, 28.6429], [77.2536, 28.5888], [76.8000, 26.8000], [76.3000, 26.0000],
      [75.8672, 25.2233], [75.5000, 24.2000], [75.0352, 23.3441], [74.0000, 22.8000],
      [73.1812, 22.3107], [73.0000, 21.8000], [72.8406, 21.2049], [72.8400, 20.0000],
      [72.8600, 19.5000], [72.8574, 19.2291], [72.8350, 19.0500], [72.8193, 18.9696]
    ]
  },
  '22436': {
    trainNumber: '22436',
    trainName: 'New Delhi - Varanasi Vande Bharat Express',
    stations: [
      { code: 'NDLS', name: 'New Delhi', latitude: 28.6429, longitude: 77.2195, scheduledDeparture: '06:00', actualDeparture: '06:00', delayMinutes: 0, distanceFromSourceKm: 0, platform: '16' },
      { code: 'CNB', name: 'Kanpur Central', latitude: 26.4547, longitude: 80.3507, scheduledArrival: '10:08', scheduledDeparture: '10:10', actualArrival: '10:10', actualDeparture: '10:12', delayMinutes: 2, distanceFromSourceKm: 440, platform: '5' },
      { code: 'PRYJ', name: 'Prayagraj Junction', latitude: 25.4484, longitude: 81.8340, scheduledArrival: '12:08', scheduledDeparture: '12:10', actualArrival: '12:10', actualDeparture: '12:12', delayMinutes: 2, distanceFromSourceKm: 635, platform: '6' },
      { code: 'BSB', name: 'Varanasi Junction', latitude: 25.3268, longitude: 82.9876, scheduledArrival: '14:00', expectedArrival: '14:00', delayMinutes: 0, distanceFromSourceKm: 759, platform: '1' }
    ],
    polyline: [
      [77.2195, 28.6429], [77.7000, 28.3000], [78.5000, 27.8000], [79.5000, 27.1000],
      [80.3507, 26.4547], [81.0000, 25.9000], [81.8340, 25.4484], [82.4000, 25.3500],
      [82.9876, 25.3268]
    ]
  },
  '12919': {
    trainNumber: '12919',
    trainName: 'Malwa Superfast Express',
    stations: [
      { code: 'DADN', name: 'Dr. Ambedkar Nagar', latitude: 22.5539, longitude: 75.7648, scheduledDeparture: '11:50', actualDeparture: '11:50', delayMinutes: 0, distanceFromSourceKm: 0, platform: '1' },
      { code: 'INDB', name: 'Indore Junction', latitude: 22.7176, longitude: 75.8682, scheduledArrival: '12:10', scheduledDeparture: '12:15', actualArrival: '12:12', actualDeparture: '12:17', delayMinutes: 2, distanceFromSourceKm: 21, platform: '4' },
      { code: 'UJN', name: 'Ujjain Junction', latitude: 23.1828, longitude: 75.7772, scheduledArrival: '13:45', scheduledDeparture: '14:00', actualArrival: '13:50', actualDeparture: '14:05', delayMinutes: 5, distanceFromSourceKm: 101, platform: '1' },
      { code: 'BPL', name: 'Bhopal Junction', latitude: 23.2599, longitude: 77.4126, scheduledArrival: '17:25', scheduledDeparture: '17:30', actualArrival: '17:30', actualDeparture: '17:35', delayMinutes: 5, distanceFromSourceKm: 284, platform: '2' },
      { code: 'GWL', name: 'Gwalior Junction', latitude: 26.2166, longitude: 78.1818, scheduledArrival: '22:30', scheduledDeparture: '22:35', actualArrival: '22:38', actualDeparture: '22:43', delayMinutes: 8, distanceFromSourceKm: 673, platform: '1' },
      { code: 'NDLS', name: 'New Delhi', latitude: 28.6429, longitude: 77.2195, scheduledArrival: '04:15', scheduledDeparture: '04:30', actualArrival: '04:20', actualDeparture: '04:35', delayMinutes: 5, distanceFromSourceKm: 986, platform: '3' },
      { code: 'LDH', name: 'Ludhiana Junction', latitude: 30.9010, longitude: 75.8573, scheduledArrival: '08:10', scheduledDeparture: '08:20', actualArrival: '08:18', actualDeparture: '08:28', delayMinutes: 8, distanceFromSourceKm: 1298, platform: '2' },
      { code: 'JAT', name: 'Jammu Tawi', latitude: 32.7060, longitude: 74.8795, scheduledArrival: '14:10', scheduledDeparture: '14:15', actualArrival: '14:15', actualDeparture: '14:20', delayMinutes: 5, distanceFromSourceKm: 1515, platform: '1' },
      { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', latitude: 32.9912, longitude: 74.9315, scheduledArrival: '16:30', expectedArrival: '16:35', delayMinutes: 5, distanceFromSourceKm: 1540, platform: '2' }
    ],
    polyline: [
      [75.7648, 22.5539], [75.8682, 22.7176], [75.7772, 23.1828], [77.4126, 23.2599],
      [78.1818, 26.2166], [77.2195, 28.6429], [76.9000, 29.5000], [75.8573, 30.9010],
      [74.8795, 32.7060], [74.9315, 32.9912]
    ]
  },
  '12626': {
    trainNumber: '12626',
    trainName: 'Kerala Express',
    stations: [
      { code: 'NDLS', name: 'New Delhi', latitude: 28.6429, longitude: 77.2195, scheduledDeparture: '20:10', actualDeparture: '20:10', delayMinutes: 0, distanceFromSourceKm: 0, platform: '3' },
      { code: 'AGC', name: 'Agra Cantt', latitude: 27.1585, longitude: 77.9904, scheduledArrival: '22:20', scheduledDeparture: '22:25', actualArrival: '22:22', actualDeparture: '22:27', delayMinutes: 2, distanceFromSourceKm: 195, platform: '1' },
      { code: 'BPL', name: 'Bhopal Junction', latitude: 23.2599, longitude: 77.4126, scheduledArrival: '05:20', scheduledDeparture: '05:25', actualArrival: '05:25', actualDeparture: '05:30', delayMinutes: 5, distanceFromSourceKm: 702, platform: '1' },
      { code: 'NGP', name: 'Nagpur Junction', latitude: 21.1524, longitude: 79.0888, scheduledArrival: '11:45', scheduledDeparture: '11:50', actualArrival: '11:50', actualDeparture: '11:55', delayMinutes: 5, distanceFromSourceKm: 1092, platform: '2' },
      { code: 'BZA', name: 'Vijayawada Junction', latitude: 16.5186, longitude: 80.6199, scheduledArrival: '22:00', scheduledDeparture: '22:10', actualArrival: '22:08', actualDeparture: '22:18', delayMinutes: 8, distanceFromSourceKm: 1756, platform: '1' },
      { code: 'MAS', name: 'Chennai Central', latitude: 13.0827, longitude: 80.2707, scheduledArrival: '04:30', scheduledDeparture: '04:45', actualArrival: '04:35', actualDeparture: '04:50', delayMinutes: 5, distanceFromSourceKm: 2187, platform: '4' },
      { code: 'ERS', name: 'Ernakulam Junction', latitude: 9.9674, longitude: 76.2941, scheduledArrival: '14:20', scheduledDeparture: '14:25', actualArrival: '14:25', actualDeparture: '14:30', delayMinutes: 5, distanceFromSourceKm: 2831, platform: '1' },
      { code: 'TVC', name: 'Thiruvananthapuram Central', latitude: 8.4875, longitude: 76.9526, scheduledArrival: '18:00', expectedArrival: '18:05', delayMinutes: 5, distanceFromSourceKm: 3036, platform: '1' }
    ],
    polyline: [
      [77.2195, 28.6429], [77.9904, 27.1585], [77.4126, 23.2599], [79.0888, 21.1524],
      [80.6199, 16.5186], [80.2707, 13.0827], [78.1460, 11.6643], [76.2941, 9.9674],
      [76.9526, 8.4875]
    ]
  },
  '12301': {
    trainNumber: '12301',
    trainName: 'Howrah - New Delhi Rajdhani Express',
    stations: [
      { code: 'HWH', name: 'Howrah Junction', latitude: 22.5840, longitude: 88.3426, scheduledDeparture: '16:50', actualDeparture: '16:50', delayMinutes: 0, distanceFromSourceKm: 0, platform: '9' },
      { code: 'ASN', name: 'Asansol Junction', latitude: 23.6889, longitude: 86.9661, scheduledArrival: '18:57', scheduledDeparture: '19:00', actualArrival: '18:59', actualDeparture: '19:02', delayMinutes: 2, distanceFromSourceKm: 200, platform: '4' },
      { code: 'DHN', name: 'Dhanbad Junction', latitude: 23.7957, longitude: 86.4304, scheduledArrival: '19:55', scheduledDeparture: '20:00', actualArrival: '19:58', actualDeparture: '20:03', delayMinutes: 3, distanceFromSourceKm: 259, platform: '3' },
      { code: 'GAYA', name: 'Gaya Junction', latitude: 24.8078, longitude: 85.0069, scheduledArrival: '22:31', scheduledDeparture: '22:34', actualArrival: '22:35', actualDeparture: '22:38', delayMinutes: 4, distanceFromSourceKm: 459, platform: '1' },
      { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Junction', latitude: 25.2818, longitude: 83.1186, scheduledArrival: '00:45', scheduledDeparture: '00:55', actualArrival: '00:50', actualDeparture: '01:00', delayMinutes: 5, distanceFromSourceKm: 664, platform: '4' },
      { code: 'PRYJ', name: 'Prayagraj Junction', latitude: 25.4484, longitude: 81.8340, scheduledArrival: '02:43', scheduledDeparture: '02:45', actualArrival: '02:48', actualDeparture: '02:50', delayMinutes: 5, distanceFromSourceKm: 817, platform: '1' },
      { code: 'CNB', name: 'Kanpur Central', latitude: 26.4547, longitude: 80.3507, scheduledArrival: '04:50', scheduledDeparture: '04:55', actualArrival: '04:55', actualDeparture: '05:00', delayMinutes: 5, distanceFromSourceKm: 1011, platform: '1' },
      { code: 'NDLS', name: 'New Delhi', latitude: 28.6429, longitude: 77.2195, scheduledArrival: '10:05', expectedArrival: '10:10', delayMinutes: 5, distanceFromSourceKm: 1451, platform: '1' }
    ],
    polyline: [
      [88.3426, 22.5840], [86.9661, 23.6889], [86.4304, 23.7957], [85.0069, 24.8078],
      [83.1186, 25.2818], [81.8340, 25.4484], [80.3507, 26.4547], [77.2195, 28.6429]
    ]
  },
  'BOXN-4021': {
    trainNumber: 'BOXN-4021',
    trainName: 'Delhi-Mumbai Container Freight Corridor Rake',
    stations: [
      { code: 'TKD', name: 'Tuglakabad Yard', latitude: 28.5033, longitude: 77.2917, scheduledDeparture: '04:15', actualDeparture: '04:15', delayMinutes: 0, distanceFromSourceKm: 0, platform: 'DFC-1' },
      { code: 'RE', name: 'Rewari Junction', latitude: 28.1920, longitude: 76.6180, scheduledArrival: '06:30', scheduledDeparture: '06:45', actualArrival: '06:32', actualDeparture: '06:47', delayMinutes: 2, distanceFromSourceKm: 85, platform: 'DFC-Loop' },
      { code: 'KOTA', name: 'Kota DFC Yard', latitude: 25.2233, longitude: 75.8672, scheduledArrival: '12:10', scheduledDeparture: '12:30', actualArrival: '12:15', actualDeparture: '12:35', delayMinutes: 5, distanceFromSourceKm: 480, platform: 'Freight-3' },
      { code: 'BRC', name: 'Vadodara Freight Corridor', latitude: 22.3107, longitude: 73.1812, scheduledArrival: '18:00', scheduledDeparture: '18:20', actualArrival: '18:05', actualDeparture: '18:25', delayMinutes: 5, distanceFromSourceKm: 990, platform: 'DFC-Yard' },
      { code: 'JNPT', name: 'JNPT Maritime Port', latitude: 18.9500, longitude: 72.9500, scheduledArrival: '22:30', expectedArrival: '22:35', delayMinutes: 5, distanceFromSourceKm: 1420, platform: 'Port-1' }
    ],
    polyline: [
      [77.2917, 28.5033], [76.6180, 28.1920], [76.0000, 27.0000], [75.8672, 25.2233],
      [74.5000, 23.5000], [73.1812, 22.3107], [72.9500, 20.0000], [72.9500, 18.9500]
    ]
  },
  'BCN-8812': {
    trainNumber: 'BCN-8812',
    trainName: 'Northern Bulk Cargo Goods Movement',
    stations: [
      { code: 'GZB', name: 'Ghaziabad Junction', latitude: 28.6692, longitude: 77.4538, scheduledDeparture: '02:00', actualDeparture: '02:00', delayMinutes: 0, distanceFromSourceKm: 0, platform: 'Goods-1' },
      { code: 'TKD', name: 'Tuglakabad Yard', latitude: 28.5033, longitude: 77.2917, scheduledArrival: '03:15', scheduledDeparture: '03:30', actualArrival: '03:18', actualDeparture: '03:33', delayMinutes: 3, distanceFromSourceKm: 45, platform: 'Goods-3' },
      { code: 'MTJ', name: 'Mathura Junction', latitude: 27.4924, longitude: 77.6737, scheduledArrival: '06:10', scheduledDeparture: '06:25', actualArrival: '06:15', actualDeparture: '06:30', delayMinutes: 5, distanceFromSourceKm: 165, platform: 'Loop-2' },
      { code: 'KOTA', name: 'Kota Junction', latitude: 25.2233, longitude: 75.8672, scheduledArrival: '12:45', expectedArrival: '12:50', delayMinutes: 5, distanceFromSourceKm: 490, platform: 'Goods-2' }
    ],
    polyline: [
      [77.4538, 28.6692], [77.2917, 28.5033], [77.6737, 27.4924], [75.8672, 25.2233]
    ]
  }
};

export async function getTrainRoute(trainNumber, date = null) {
  try {
    const url = date
      ? `${BASE_URL}/api/trains/${encodeURIComponent(trainNumber)}/route?date=${encodeURIComponent(date)}`
      : `${BASE_URL}/api/trains/${encodeURIComponent(trainNumber)}/route`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[trainService] getTrainRoute backend fetch failed:', err.message);
  }

  // Fallback to embedded route definition
  const route = MOCK_ROUTES[trainNumber] || MOCK_ROUTES['12002'];
  if (route) {
    return {
      success: true,
      route: {
        trainNumber: route.trainNumber,
        trainName: route.trainName,
        geometry: {
          type: 'LineString',
          coordinates: route.polyline || []
        },
        stations: route.stations || []
      }
    };
  }
  return { success: false, error: 'Route not found' };
}

export async function getTrainAnalytics(trainNumber, date = null) {
  try {
    const url = date
      ? `${BASE_URL}/api/trains/${encodeURIComponent(trainNumber)}/analytics?date=${encodeURIComponent(date)}`
      : `${BASE_URL}/api/trains/${encodeURIComponent(trainNumber)}/analytics`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[trainService] getTrainAnalytics failed:', err.message);
  }
  return { success: false, error: 'Analytics not available' };
}

