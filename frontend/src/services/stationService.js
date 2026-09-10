/**
 * Station Service Layer
 * Clean abstraction for Station metadata and Station Operations Timetables
 */
import { STATIONS } from '../data/stations';
import { STATION_TIMETABLES } from '../data/timetable';

export async function getStations() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(STATIONS);
    }, 100);
  });
}

export async function getStationTimetable(stationCode = 'NDLS') {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(STATION_TIMETABLES[stationCode] || STATION_TIMETABLES['NDLS']);
    }, 100);
  });
}
