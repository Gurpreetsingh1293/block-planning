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
 * Railway Officer Authentication
 * POST /api/auth/login
 * @param {Object} credentials
 * @param {string} credentials.userId
 * @param {string} credentials.password
 * @param {string} credentials.department
 */
export async function loginUser({ userId, password, department }) {
  const url = `${BASE_URL}/api/auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password, department }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Please check your credentials.');
  }

  // Store session in localStorage
  if (data.token) {
    localStorage.setItem('rbp_token', data.token);
    localStorage.setItem('rbp_user', JSON.stringify(data.user));
  }

  return data;
}

/**
 * Fetch Demo Accounts from backend for developer/demo convenience
 */
export async function fetchDemoAccounts() {
  const url = `${BASE_URL}/api/auth/demo-accounts`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch demo accounts');
  return await response.json();
}

/**
 * Get current logged in officer from localStorage
 */
export function getStoredUser() {
  try {
    const userStr = localStorage.getItem('rbp_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    return null;
  }
}

/**
 * Log out current session
 */
export function logoutUser() {
  localStorage.removeItem('rbp_token');
  localStorage.removeItem('rbp_user');
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
