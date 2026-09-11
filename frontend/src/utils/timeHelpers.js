/**
 * Time and Block Utility Helpers for Railway Calendar Timeline
 * Used across TeamsCalendarTimeline, BlockCards, and Tooltip
 */

/**
 * Converts a time string ("10:00 AM", "10:00", "14:30") to total minutes from midnight
 * @param {string} timeStr
 * @returns {number} minutes from midnight (0-1439)
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;

  const str = String(timeStr).trim().toUpperCase();

  // Handle "HH:MM AM/PM" format (12-hour)
  const twelveHour = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (twelveHour) {
    let hour = parseInt(twelveHour[1], 10);
    const min = parseInt(twelveHour[2], 10);
    const period = twelveHour[3];
    if (period === 'AM' && hour === 12) hour = 0;
    if (period === 'PM' && hour !== 12) hour += 12;
    return hour * 60 + min;
  }

  // Handle "HH:MM" 24-hour format
  const twentyFourHour = str.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHour) {
    const hour = parseInt(twentyFourHour[1], 10);
    const min = parseInt(twentyFourHour[2], 10);
    return hour * 60 + min;
  }

  // Handle bare hour like "10" or "14"
  const bareHour = str.match(/^(\d{1,2})$/);
  if (bareHour) {
    return parseInt(bareHour[1], 10) * 60;
  }

  return 0;
}

/**
 * Convert minutes from midnight to display string "10:00 AM"
 * @param {number} minutes
 * @returns {string}
 */
export function minutesToDisplayTime(minutes) {
  if (minutes === undefined || minutes === null || isNaN(minutes)) return '--:--';
  const clamped = Math.max(0, Math.min(1439, minutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Format a time string for display (converts 24-hr to 12-hr)
 * @param {string} timeStr - "14:30" or "2:30 PM"
 * @returns {string} "2:30 PM"
 */
export function formatDisplayTime(timeStr) {
  const minutes = parseTimeToMinutes(timeStr);
  return minutesToDisplayTime(minutes);
}

/**
 * Get block display color style for each colorKey
 * Returns an object with bg, border, text colors
 */
export const BLOCK_COLORS = {
  gold: {
    bg: '#DCBF7B',
    bgHover: '#d4b366',
    border: '#c9a347',
    text: '#3a2a00',
    badge: '#a07830',
  },
  teal: {
    bg: '#7AAFA7',
    bgHover: '#6a9f97',
    border: '#5a8f87',
    text: '#002826',
    badge: '#3d7870',
  },
  terracotta: {
    bg: '#D9968A',
    bgHover: '#cc8070',
    border: '#c06a5a',
    text: '#3a0a00',
    badge: '#a04540',
  },
  purple: {
    bg: '#AF9DC9',
    bgHover: '#9f8db9',
    border: '#8f7da9',
    text: '#150028',
    badge: '#7060a0',
  },
  gray: {
    bg: '#9eafc2',
    bgHover: '#8fa0b2',
    border: '#7f90a2',
    text: '#1a2530',
    badge: '#506070',
  },
  white: {
    bg: '#FFFFFF',
    bgHover: '#f5f8ff',
    border: '#3B82F6',
    text: '#1e40af',
    badge: '#3B82F6',
  },
};

/**
 * Safe engineer name extractor — prevents React child rendering errors
 * when bookedBy might be an object {name, department} from legacy data
 */
export function getEngineerName(block) {
  if (!block) return 'Junior Engineer';
  if (typeof block.bookedBy === 'string' && block.bookedBy.trim()) return block.bookedBy;
  if (block.bookedBy?.name) return block.bookedBy.name;
  if (typeof block.inCharge === 'string' && block.inCharge.trim()) return block.inCharge;
  if (block.inCharge?.name) return block.inCharge.name;
  return 'Junior Engineer';
}

/**
 * Get display label for department
 */
export function getDeptLabel(dept) {
  if (!dept) return 'All Departments';
  return dept;
}

/**
 * Returns the ISO date string (YYYY-MM-DD) for a date offset from today
 */
export function getDateForOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

/**
 * Returns array of 7 date strings (YYYY-MM-DD) for the week containing a date
 * Week starts on Sunday
 */
export function getWeekDates(refDate) {
  const d = refDate ? new Date(refDate) : new Date();
  const day = d.getDay(); // 0 = Sunday
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const curr = new Date(d);
    curr.setDate(d.getDate() - day + i);
    dates.push(curr.toISOString().split('T')[0]);
  }
  return dates;
}

/**
 * Returns array of date objects for the month grid (5-6 rows, starts on Sunday)
 */
export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Fill leading days from previous month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const d = new Date(year, month, 1 - (firstDay.getDay() - i));
    days.push({ date: d.toISOString().split('T')[0], currentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    days.push({ date: d.toISOString().split('T')[0], currentMonth: true });
  }

  // Fill trailing days for next month to complete grid
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d.toISOString().split('T')[0], currentMonth: false });
  }

  return days;
}

/**
 * Format date string "YYYY-MM-DD" to "Thu, Sep 16"
 */
export function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Format week range label: "September 6 – September 12, 2026"
 */
export function formatWeekRange(weekDates) {
  if (!weekDates || weekDates.length === 0) return '';
  const start = new Date(weekDates[0] + 'T12:00:00');
  const end = new Date(weekDates[6] + 'T12:00:00');
  const opts = { month: 'long', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}, ${end.getFullYear()}`;
}

/**
 * Returns true if dateStr is today
 */
export function isToday(dateStr) {
  return dateStr === new Date().toISOString().split('T')[0];
}

/**
 * All 24 hours array for time gutter
 */
export const HOURS_24 = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return '12 AM';
  if (i < 12) return `${i} AM`;
  if (i === 12) return '12 PM';
  return `${i - 12} PM`;
});

/**
 * Hours array with minute values
 */
export const HOUR_ENTRIES = Array.from({ length: 24 }, (_, i) => ({
  label: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
  minutes: i * 60,
}));
