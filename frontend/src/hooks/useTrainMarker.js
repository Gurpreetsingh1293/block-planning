import { useState, useEffect, useRef } from 'react';
import { interpolateCoordinate, calculateBearing, snapPointToPolyline } from '../utils/geo';

/**
 * Hook to smoothly animate train marker between coordinates during live telemetry updates
 * @param {Object} position - { latitude, longitude, bearing, speedKmh } or { lat, lng, bearing }
 * @param {Array} routePolyline - optional [[lng, lat], ...] to lock marker directly to railway track
 * @param {number} animationDuration - duration in ms to animate over
 */
export function useTrainMarker(position, routePolyline = null, animationDuration = 2500) {
  const [animatedPos, setAnimatedPos] = useState({
    latitude: position?.latitude || position?.lat || 28.6139,
    longitude: position?.longitude || position?.lng || 77.2090,
    bearing: position?.bearing || 0
  });

  const prevPosRef = useRef(null);
  const targetPosRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const rawLat = position?.latitude ?? position?.lat;
    const rawLng = position?.longitude ?? position?.lng;
    if (typeof rawLat !== 'number' || typeof rawLng !== 'number' || isNaN(rawLat) || isNaN(rawLng)) return;

    let targetLng = rawLng;
    let targetLat = rawLat;
    let trackBearing = position?.bearing;

    // Snap to route polyline if available so marker is locked to the physical railway track
    if (routePolyline && Array.isArray(routePolyline) && routePolyline.length >= 2) {
      const snapped = snapPointToPolyline([rawLng, rawLat], routePolyline);
      targetLng = snapped.point[0];
      targetLat = snapped.point[1];
      if (trackBearing === undefined || trackBearing === null || trackBearing === 0) {
        trackBearing = snapped.bearing;
      }
    }

    const currentTarget = {
      latitude: targetLat,
      longitude: targetLng,
      bearing: trackBearing || 0
    };

    // If initial load or positions match, set directly
    if (!prevPosRef.current) {
      prevPosRef.current = currentTarget;
      targetPosRef.current = currentTarget;
      setAnimatedPos(currentTarget);
      return;
    }

    const startLat = prevPosRef.current.latitude;
    const startLng = prevPosRef.current.longitude;

    // Check distance jump (e.g. user selected another train across the country)
    const dx = (targetLng - startLng) * 111;
    const dy = (targetLat - startLat) * 111;
    const distanceKm = Math.sqrt(dx * dx + dy * dy);

    // If jump > 35km or no movement, snap immediately without gliding across India
    if (distanceKm > 35 || distanceKm < 0.0001) {
      prevPosRef.current = currentTarget;
      targetPosRef.current = currentTarget;
      setAnimatedPos(currentTarget);
      return;
    }

    let startBearing = prevPosRef.current.bearing || 0;
    let finalBearing = trackBearing;
    if (finalBearing === undefined || finalBearing === null) {
      finalBearing = calculateBearing(startLat, startLng, targetLat, targetLng);
    }

    // Shortest rotational path
    let bearingDiff = (finalBearing - startBearing) % 360;
    if (bearingDiff > 180) bearingDiff -= 360;
    if (bearingDiff < -180) bearingDiff += 360;

    targetPosRef.current = { ...currentTarget, bearing: finalBearing };
    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime;
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / animationDuration, 1.0);

      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      const [curLng, curLat] = interpolateCoordinate(
        [startLng, startLat],
        [targetLng, targetLat],
        ease
      );

      const currentBearing = (startBearing + bearingDiff * ease + 360) % 360;

      setAnimatedPos({
        latitude: curLat,
        longitude: curLng,
        bearing: currentBearing
      });

      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevPosRef.current = targetPosRef.current;
      }
    };

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [position?.latitude, position?.lat, position?.longitude, position?.lng, position?.bearing, routePolyline, animationDuration]);

  return animatedPos;
}
