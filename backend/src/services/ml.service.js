const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Calls the Python FastAPI ML Service to assess block scheduling risk.
 * @param {Object} blockParams
 * @param {string} blockParams.sectionCode
 * @param {string} blockParams.workType
 * @param {number} blockParams.requestedDurationMinutes
 * @param {number} blockParams.scheduledHour
 */
const predictBlockRisk = async (blockParams) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict-risk`,
      {
        section_id: blockParams.sectionCode,
        work_type: blockParams.workType,
        requested_duration_min: blockParams.requestedDurationMinutes,
        scheduled_hour: blockParams.scheduledHour || 2,
      },
      { timeout: 4000 }
    );
    return response.data;
  } catch (error) {
    console.warn(`[ML Service Warning] Failed to reach ML service at ${ML_SERVICE_URL}: ${error.message}`);
    // Fallback baseline score if ML service is offline
    return {
      risk_score: 0.25,
      confidence: 0.6,
      recommended_window: '01:30 - 04:30',
      risk_level: 'Low (Fallback Heuristic)',
      offline_fallback: true,
    };
  }
};

module.exports = {
  predictBlockRisk,
};
