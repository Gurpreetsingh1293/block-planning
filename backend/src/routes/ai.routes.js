/**
 * AI Engine Routes
 * Handles Groq-powered AI optimization for block planning
 */

const express = require('express');
const router = express.Router();
const groqService = require('../services/groqService');

/**
 * POST /api/ai/optimize-schedule
 * Optimize block schedule using AI
 */
router.post('/optimize-schedule', async (req, res) => {
  try {
    const {
      maintenanceTasks,
      passengerTrains,
      goodsTrains,
      corridorAvailability,
      corridorInfo
    } = req.body;

    // Validate required data
    if (!maintenanceTasks || !passengerTrains || !corridorAvailability) {
      return res.status(400).json({
        success: false,
        error: 'Missing required data: maintenanceTasks, passengerTrains, or corridorAvailability'
      });
    }

    // Check if Groq service is available
    if (!groqService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'AI optimization service is not configured. Please set GROQ_API_KEY in environment variables.'
      });
    }

    // Call Groq service for optimization
    const result = await groqService.optimizeBlockSchedule({
      maintenanceTasks,
      passengerTrains,
      goodsTrains,
      corridorAvailability,
      corridorInfo
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI optimization error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'AI optimization failed'
    });
  }
});

/**
 * POST /api/ai/what-if
 * Analyze What-If scenario
 */
router.post('/what-if', async (req, res) => {
  try {
    const {
      scenarioType,
      currentPlan,
      proposedChange,
      passengerTrains,
      goodsTrains,
      maintenanceTasks
    } = req.body;

    // Validate required data
    if (!scenarioType || !currentPlan || !proposedChange) {
      return res.status(400).json({
        success: false,
        error: 'Missing required data: scenarioType, currentPlan, or proposedChange'
      });
    }

    // Check if Groq service is available
    if (!groqService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'AI analysis service is not configured. Please set GROQ_API_KEY in environment variables.'
      });
    }

    // Call Groq service for What-If analysis
    const result = await groqService.analyzeWhatIfScenario({
      scenarioType,
      currentPlan,
      proposedChange,
      passengerTrains,
      goodsTrains,
      maintenanceTasks
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('What-If analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'What-If analysis failed'
    });
  }
});

/**
 * GET /api/ai/status
 * Check AI service availability
 */
router.get('/status', (req, res) => {
  const available = groqService.isAvailable();
  res.json({
    success: true,
    data: {
      aiServiceAvailable: available,
      provider: 'Groq',
      model: 'openai/gpt-oss-20b',
      features: {
        scheduleOptimization: available,
        whatIfAnalysis: available,
        prioritization: available
      }
    }
  });
});

module.exports = router;
