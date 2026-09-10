/**
 * Time and date formatting utilities for Railway Operations
 */

/**
 * Format timestamp or 24-hour time string
 * @param {string|Date} time - e.g. "09:35" or Date object
 * @returns {string} formatted time e.g. "09:35 HRS"
 */
export function formatTime24(time) {
  if (!time) return '--:--';
  if (typeof time === 'string') return time;
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Calculate duration in hours and minutes from slot
 * @param {string} start - e.g. "08:00"
 * @param {string} end - e.g. "10:00"
 * @returns {string} e.g. "2h 00m"
 */
export function calculateDuration(start, end) {
  if (!start || !end) return '';
  const [sH, sM] = start.split(':').map(Number);
  const [eH, eM] = end.split(':').map(Number);
  const diffMins = (eH * 60 + eM) - (sH * 60 + sM);
  if (diffMins <= 0) return '0m';
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;
}

/**
 * Format relative delay message
 * @param {number} delayMins
 * @returns {string} e.g. "+12 MIN" or "ON TIME"
 */
export function formatDelay(delayMins) {
  if (!delayMins || delayMins === 0) return 'ON TIME';
  return `+${delayMins} MIN`;
}
