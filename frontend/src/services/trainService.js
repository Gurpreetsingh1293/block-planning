/**
 * Train Service Layer
 * Clean abstraction over mock data / future Express API (/api/trains)
 */
import { PASSENGER_TRAINS, FREIGHT_TRAINS } from '../data/trains';

export async function getTrains(type = 'ALL') {
  // Simulating async network call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (type === 'PASSENGER') {
        resolve(PASSENGER_TRAINS);
      } else if (type === 'CARGO') {
        resolve(FREIGHT_TRAINS);
      } else {
        resolve([...PASSENGER_TRAINS, ...FREIGHT_TRAINS]);
      }
    }, 100);
  });
}

export async function getTrainById(trainId) {
  return new Promise((resolve) => {
    const all = [...PASSENGER_TRAINS, ...FREIGHT_TRAINS];
    const found = all.find((t) => t.id === trainId || t.number.includes(trainId));
    resolve(found || null);
  });
}

export async function searchTrains(query, type = 'ALL') {
  const list = await getTrains(type);
  if (!query || query.trim() === '') return list;
  const q = query.toLowerCase().trim();
  return list.filter((t) => 
    t.number.toLowerCase().includes(q) ||
    t.name.toLowerCase().includes(q) ||
    t.source.toLowerCase().includes(q) ||
    t.destination.toLowerCase().includes(q) ||
    t.currentStation.toLowerCase().includes(q)
  );
}
