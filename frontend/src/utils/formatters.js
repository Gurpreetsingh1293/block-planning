/**
 * Display formatters for train telemetry, times and distances
 * Ported from RailPulse domain architecture
 */

export function formatDelayText(delayMinutes) {
  if (!delayMinutes || delayMinutes === 0) return 'On Time';
  if (delayMinutes < 0) return `${Math.abs(delayMinutes)}m Early`;
  if (delayMinutes < 60) return `${delayMinutes}m Late`;
  const hours = Math.floor(delayMinutes / 60);
  const mins = delayMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m Late` : `${hours}h Late`;
}

export function formatDistanceKm(km) {
  if (km === undefined || km === null) return '-- km';
  return `${Math.round(km).toLocaleString()} km`;
}

export function formatSpeedKmh(speed) {
  if (speed === undefined || speed === null || speed < 0) return '-- km/h';
  return `${Math.round(speed)} km/h`;
}

export function formatTimeAmPm(isoOrTimeStr) {
  if (!isoOrTimeStr) return '--:--';
  if (/^\d{2}:\d{2}$/.test(isoOrTimeStr)) {
    const [h, m] = isoOrTimeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  }
  const d = new Date(isoOrTimeStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  return isoOrTimeStr;
}

export function formatRelativeTime(isoStr) {
  if (!isoStr) return 'recently';
  const diffMs = Date.now() - new Date(isoStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}
