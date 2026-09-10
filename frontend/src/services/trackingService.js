/**
 * Live Tracking Service Layer
 * Corridors, live metrics, and real-time movement monitoring
 */
import { CORRIDORS, TRACKING_METRICS } from '../data/tracking';
import { PASSENGER_TRAINS, FREIGHT_TRAINS } from '../data/trains';

export async function getCorridors() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(CORRIDORS);
    }, 100);
  });
}

export async function getTrackingMetrics() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(TRACKING_METRICS);
    }, 100);
  });
}

export async function getLiveMovement(viewType = 'PASSENGER') {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (viewType === 'PASSENGER') {
        resolve(PASSENGER_TRAINS);
      } else if (viewType === 'CARGO') {
        resolve(FREIGHT_TRAINS);
      } else {
        resolve([...PASSENGER_TRAINS, ...FREIGHT_TRAINS]);
      }
    }, 100);
  });
}
