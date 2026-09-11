/**
 * Geospatial calculation utilities
 * Ported from RailPulse domain architecture
 */

export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function calculateBearing(lat1, lon1, lat2, lon2) {
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  const theta = Math.atan2(y, x);
  const bearing = (toDeg(theta) + 360) % 360;
  return Math.round(bearing);
}

export function interpolateCoordinate(coord1, coord2, progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  const lng = coord1[0] + (coord2[0] - coord1[0]) * clamped;
  const lat = coord1[1] + (coord2[1] - coord1[1]) * clamped;
  return [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
}

export function snapPointToPolyline(point, polyline) {
  if (!polyline || polyline.length < 2 || !point) return { point, bearing: 0 };
  const px = point[0]; // lng
  const py = point[1]; // lat
  let minDistanceSq = Infinity;
  let nearestPoint = point;
  let segmentBearing = 0;

  for (let i = 0; i < polyline.length - 1; i++) {
    const ax = polyline[i][0];
    const ay = polyline[i][1];
    const bx = polyline[i + 1][0];
    const by = polyline[i + 1][1];
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;

    let t = 0;
    if (lenSq > 0) {
      t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    }

    const qx = ax + t * dx;
    const qy = ay + t * dy;
    const distSq = (px - qx) * (px - qx) + (py - qy) * (py - qy);

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      nearestPoint = [Number(qx.toFixed(6)), Number(qy.toFixed(6))];
      segmentBearing = calculateBearing(ay, ax, by, bx);
    }
  }
  return { point: nearestPoint, bearing: segmentBearing };
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

