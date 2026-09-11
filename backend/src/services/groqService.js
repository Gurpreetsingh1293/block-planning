/**
 * Groq AI Service
 * Handles AI optimization for Railway Block Planning
 * Uses Groq API for intelligent scheduling, prioritization, and recommendations
 */

const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.client = null;
    this.getClient();
  }

  /**
   * Get or dynamically initialize Groq client
   */
  getClient() {
    if (!this.client) {
      try {
        require('dotenv').config();
      } catch (e) {}
      const apiKey = process.env.GROQ_API_KEY;
      if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.startsWith('gsk_')) {
        this.client = new Groq({ apiKey });
        console.log('[GroqService] Groq AI client initialized successfully.');
      }
    }
    return this.client;
  }

  /**
   * Check if Groq service is available
   */
  isAvailable() {
    return this.getClient() !== null;
  }

  /**
   * Optimize block schedule using AI
   * Takes preprocessed/filtered railway data and returns optimized schedule
   */
  async optimizeBlockSchedule(data) {
    if (!this.isAvailable()) {
      throw new Error('Groq AI service is not configured');
    }

    const {
      maintenanceTasks,
      passengerTrains,
      goodsTrains,
      corridorAvailability,
      corridorInfo
    } = data;

    // Construct the prompt for AI optimization
    const prompt = this.buildOptimizationPrompt({
      maintenanceTasks,
      passengerTrains,
      goodsTrains,
      corridorAvailability,
      corridorInfo
    });

    try {
      const completion = await this.client.chat.completions.create({
        model: 'openai/gpt-oss-120b',  // ✅ FIXED: Changed from gpt-oss-20b to gpt-oss-120b
        messages: [
          {
            role: 'system',
            content: `You are a railway maintenance optimizer. Create optimized maintenance blocks that:
1. Avoid passenger train schedules (HARD CONSTRAINT)
2. Group compatible tasks
3. Minimize disruption
4. Prioritize safety-critical work

Respond ONLY with valid JSON. No markdown, no explanations outside JSON.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 8000,  // ✅ INCREASED from 4000 to 8000
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from Groq API');
      }

      // ✅ FIXED: Enhanced JSON parsing with validation and markdown removal
      let cleanedResponse = response.trim();
      
      // Remove markdown code fences if present (```json ... ``` or ``` ... ```)
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '')
        .trim();
      
      // Log the cleaned response for debugging
      console.log('[Groq] Response received, length:', cleanedResponse.length);
      
      let parsed;
      try {
        parsed = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('[Groq] JSON Parse Error:', parseError.message);
        console.error('[Groq] Raw response (first 500 chars):', response.substring(0, 500));
        console.error('[Groq] Cleaned response (first 500 chars):', cleanedResponse.substring(0, 500));
        throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
      }
      
      // Validate required fields in response
      if (!parsed.optimizedBlocks || !Array.isArray(parsed.optimizedBlocks)) {
        console.error('[Groq] Invalid response structure:', JSON.stringify(parsed).substring(0, 200));
        throw new Error('Invalid AI response: missing or invalid optimizedBlocks array');
      }
      
      // Ensure each block has required fields
      parsed.optimizedBlocks = parsed.optimizedBlocks.map(block => ({
        blockId: block.blockId || `BLK-${Date.now()}`,
        priority: block.priority || 'MEDIUM',
        startTime: block.startTime || '22:00',
        endTime: block.endTime || '01:00',
        taskIds: Array.isArray(block.taskIds) ? block.taskIds : [],
        departments: Array.isArray(block.departments) ? block.departments : ['Engineering'],
        location: block.location || 'N/A',
        estimatedDuration: block.estimatedDuration || 2,
        requiredWorkers: block.requiredWorkers || 5,
        requiredEquipment: Array.isArray(block.requiredEquipment) ? block.requiredEquipment : [],
        affectedPassengerTrains: block.affectedPassengerTrains || 0,
        affectedGoodsTrains: block.affectedGoodsTrains || 0,
        reasoning: block.reasoning || 'Optimized for minimal disruption'
      }));
      
      if (!parsed.summary || typeof parsed.summary !== 'object') {
        console.warn('[Groq] Warning: Response missing summary object, creating default');
        parsed.summary = {
          totalBlocks: parsed.optimizedBlocks.length,
          criticalTasks: maintenanceTasks.filter(t => t.criticality === 'Critical' || t.urgency === 'Emergency').length,
          tasksGrouped: 0,
          passengerTrainsAffected: 0,
          goodsTrainsAffected: parsed.optimizedBlocks.reduce((sum, b) => sum + (b.affectedGoodsTrains || 0), 0),
          estimatedDowntime: `${parsed.optimizedBlocks.reduce((sum, b) => sum + (b.estimatedDuration || 0), 0)} hours`
        };
      }
      
      console.log('[Groq] Successfully parsed response with', parsed.optimizedBlocks.length, 'optimized blocks');
      
      return parsed;
    } catch (error) {
      console.error('[Groq] Optimization error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('API key')) {
        throw new Error('Groq API key is invalid or not configured. Please check GROQ_API_KEY in .env file.');
      } else if (error.message?.includes('model')) {
        throw new Error('Groq model error. The specified model may not be available. Please check your Groq account.');
      } else if (error.message?.includes('rate limit')) {
        throw new Error('Groq API rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message?.includes('parse')) {
        throw new Error(`AI optimization failed: ${error.message}`);
      } else {
        throw new Error(`AI optimization failed: ${error.message || 'Unknown error occurred'}`);
      }
    }
  }

  /**
   * Build optimization prompt with structured data (SIMPLIFIED & COMPRESSED)
   */
  buildOptimizationPrompt(data) {
    const {
      maintenanceTasks,
      passengerTrains,
      goodsTrains,
      corridorAvailability
    } = data;

    // SIMPLIFIED: Only include essential data to avoid token limits
    const tasksSummary = maintenanceTasks.map(t => ({
      id: t.taskId,
      dept: t.department,
      loc: t.location || t.section,
      crit: t.criticality,
      urg: t.urgency,
      dur: t.estimatedDuration,
      workers: t.requiredWorkers
    }));

    const trainsSummary = passengerTrains.map(t => ({
      num: t.trainNumber,
      name: t.trainName,
      dept: t.stations?.[0]?.departureTime || 'N/A',
      arr: t.stations?.[t.stations.length - 1]?.arrivalTime || 'N/A'
    }));

    return `You are optimizing railway maintenance blocks for Indian Railways.

TASKS (${tasksSummary.length}):
${JSON.stringify(tasksSummary)}

PASSENGER TRAINS (${trainsSummary.length}) - DO NOT DISRUPT:
${JSON.stringify(trainsSummary)}

AVAILABLE WINDOWS:
${JSON.stringify(corridorAvailability)}

GOODS TRAINS: ${goodsTrains.length} (can be rescheduled)

INSTRUCTIONS:
1. Create optimized maintenance blocks
2. Avoid passenger train times (HARD CONSTRAINT)
3. Group compatible tasks when possible
4. Provide clear reasoning

RESPOND WITH THIS EXACT JSON STRUCTURE (NO EXTRA TEXT):
{
  "optimizedBlocks": [
    {
      "blockId": "BLK-001",
      "priority": "CRITICAL",
      "startTime": "22:00",
      "endTime": "01:00",
      "taskIds": ["ENG-001"],
      "departments": ["Engineering"],
      "location": "Delhi-Mathura KM 42-45",
      "estimatedDuration": 3,
      "requiredWorkers": 5,
      "requiredEquipment": ["Tamping Machine"],
      "affectedPassengerTrains": 0,
      "affectedGoodsTrains": 1,
      "reasoning": "Night window selected to avoid passenger traffic"
    }
  ],
  "summary": {
    "totalBlocks": 3,
    "criticalTasks": 2,
    "tasksGrouped": 0,
    "passengerTrainsAffected": 0,
    "goodsTrainsAffected": 2,
    "estimatedDowntime": "6 hours"
  }
}`;
  }

  /**
   * Analyze What-If scenario
   * Simulates impact of changes to the block plan
   */
  async analyzeWhatIfScenario(scenario) {
    if (!this.isAvailable()) {
      throw new Error('Groq AI service is not configured');
    }

    const prompt = this.buildWhatIfPrompt(scenario);

    try {
      const completion = await this.client.chat.completions.create({
        model: 'openai/gpt-oss-120b',  // ✅ FIXED: Changed from gpt-oss-20b to gpt-oss-120b
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for Railway Block Planning What-If Analysis.

Analyze the impact of proposed changes and provide:
1. Calculated impact on trains (passenger and goods)
2. Impact on maintenance schedule
3. Asset downtime changes
4. Resource utilization changes
5. Risk assessment
6. Alternative recommendations

Be precise and transparent. Respond with valid JSON only. Do not include markdown code fences.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from Groq API');
      }

      // ✅ FIXED: Enhanced JSON parsing with validation and markdown removal
      let cleanedResponse = response.trim();
      
      // Remove markdown code fences if present
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '')
        .trim();
      
      console.log('[Groq What-If] Response received, length:', cleanedResponse.length);
      
      let parsed;
      try {
        parsed = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('[Groq What-If] JSON Parse Error:', parseError.message);
        console.error('[Groq What-If] Raw response (first 500 chars):', response.substring(0, 500));
        throw new Error(`Failed to parse What-If analysis response: ${parseError.message}`);
      }
      
      // Validate required fields
      if (!parsed.impact || typeof parsed.impact !== 'object') {
        console.warn('[Groq What-If] Warning: Response missing impact object');
      }
      
      if (!parsed.recommendation || typeof parsed.recommendation !== 'object') {
        console.warn('[Groq What-If] Warning: Response missing recommendation object');
      }
      
      console.log('[Groq What-If] Successfully parsed What-If analysis response');
      
      return parsed;
    } catch (error) {
      console.error('[Groq What-If] Analysis error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('API key')) {
        throw new Error('Groq API key is invalid or not configured.');
      } else if (error.message?.includes('rate limit')) {
        throw new Error('Groq API rate limit exceeded. Please wait and try again.');
      } else if (error.message?.includes('parse')) {
        throw new Error(`What-If analysis failed: ${error.message}`);
      } else {
        throw new Error(`What-If analysis failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Build What-If scenario prompt
   */
  buildWhatIfPrompt(scenario) {
    const {
      scenarioType,
      currentPlan,
      proposedChange,
      passengerTrains,
      goodsTrains,
      maintenanceTasks
    } = scenario;

    return `Analyze this What-If scenario for Railway Block Planning:

SCENARIO TYPE: ${scenarioType}

CURRENT PLAN:
${JSON.stringify(currentPlan, null, 2)}

PROPOSED CHANGE:
${JSON.stringify(proposedChange, null, 2)}

PASSENGER TRAINS:
${passengerTrains.map(t => `Train ${t.trainNumber}: ${t.stations[0].departureTime} - ${t.stations[t.stations.length-1].arrivalTime}`).join('\n')}

GOODS TRAINS:
${goodsTrains.map(g => `${g.trainNumber}: ${g.expectedDeparture} - ${g.expectedArrival}`).join('\n')}

MAINTENANCE TASKS:
${maintenanceTasks.map(t => `${t.taskId}: ${t.defect} (${t.estimatedDuration}h)`).join('\n')}

Provide analysis in this JSON structure:
{
  "impact": {
    "passengerTrains": {
      "affected": number,
      "details": ["array of affected trains with impact description"]
    },
    "goodsTrains": {
      "affected": number,
      "details": ["array of affected trains"]
    },
    "maintenance": {
      "tasksDelayed": number,
      "tasksAffected": ["array of task IDs"],
      "backlogIncrease": number
    },
    "assetDowntime": {
      "additional": number,
      "description": "string"
    },
    "resources": {
      "workersAffected": number,
      "equipmentImpact": "string"
    }
  },
  "riskAssessment": {
    "level": "LOW|MEDIUM|HIGH|CRITICAL",
    "factors": ["array of risk factors"],
    "mitigation": ["array of mitigation suggestions"]
  },
  "recommendation": {
    "action": "APPROVE|REJECT|MODIFY",
    "reasoning": "string",
    "alternatives": [
      {
        "description": "string",
        "benefits": "string"
      }
    ]
  },
  "comparison": {
    "before": "description of current state",
    "after": "description of state after change",
    "keyDifferences": ["array of key changes"]
  }
}`;
  }
}

module.exports = new GroqService();
