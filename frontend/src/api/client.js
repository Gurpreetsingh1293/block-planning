/**
 * API Client for SIH Block Planning Backend
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Performs a health check request to GET /api/health
 * @returns {Promise<Object>} API Health payload
 */
export async function fetchHealth() {
  const url = `${BASE_URL}/api/health`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Fetch sections list
 */
export async function fetchSections() {
  const url = `${BASE_URL}/api/sections`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch sections');
  return await response.json();
}

/**
 * Fetch train schedules
 */
export async function fetchTrainSchedules() {
  const url = `${BASE_URL}/api/train-schedules`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch train schedules');
  return await response.json();
}
