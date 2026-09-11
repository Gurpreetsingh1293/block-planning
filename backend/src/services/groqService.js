/**
 * Groq AI Service
 * Handles AI optimization for Railway Block Planning
 * Uses Groq API for intelligent scheduling, prioritization, and recommendations
 */

const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not configured. AI optimization features will be disabled.');
      this.client = null;
    } else {
      this.client = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });
    }
  }

  /**
   * Check if Groq service is available
   */
  isAvailable() {
    return this.client !== null;
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
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: `You are an AI optimization assistant for Indian Railways Automatic Block Planning System. 

Your role is to:
1. Prioritize maintenance tasks based on criticality, urgency, safety impact, and operational impact
2. Identify optimal maintenance windows that minimize train disruption
3. Group compatible maintenance tasks when feasible
4. Explain your reasoning transparently
5. Provide actionable recommendations

IMPORTANT CONSTRAINTS:
- Passenger train schedules are HARD CONSTRAINTS - do not recommend blocks during passenger train movements
- Prioritize safety-critical and emergency maintenance
- Consider corridor availability windows
- Account for goods train movements but they can be rescheduled if necessary
- Group tasks only if they are spatially compatible and have compatible resource requirements

Respond with valid JSON only.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from Groq API');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error(`AI optimization failed: ${error.message}`);
    }
  }

  /**
   * Build optimization prompt with structured data
   */
  buildOptimizationPrompt(data) {
    const {
      maintenanceTasks,
      passengerTrains,
      goodsTrains,
      corridorAvailability,
      corridorInfo
    } = data;

    return `Analyze the following railway maintenance data and provide an optimized block schedule:

CORRIDOR INFORMATION:
${JSON.stringify(corridorInfo, null, 2)}

AVAILABLE MAINTENANCE WINDOWS:
${JSON.stringify(corridorAvailability, null, 2)}

PASSENGER TRAINS (HARD CONSTRAINTS - DO NOT DISRUPT):
${passengerTrains.map(t => `Train ${t.trainNumber} (${t.trainName}): Departs ${t.stations[0].departureTime}, Arrives ${t.stations[t.stations.length-1].arrivalTime}`).join('\n')}

GOODS TRAINS (CAN BE RESCHEDULED IF NECESSARY):
${goodsTrains.map(g => `${g.trainNumber}: Expected ${g.expectedDeparture} - ${g.expectedArrival}`).join('\n')}

MAINTENANCE TASKS REQUIRING OPTIMIZATION:
${maintenanceTasks.map(task => `
Task: ${task.taskId}
Department: ${task.department}
Location: ${task.location}
Issue: ${task.defect}
Criticality: ${task.criticality}
Urgency: ${task.urgency}
Duration: ${task.estimatedDuration} hours
Workers: ${task.requiredWorkers}
Equipment: ${task.requiredEquipment.join(', ')}
Preferred Window: ${task.preferredTimeWindow}
Safety Impact: ${task.safetyImpact}
Operational Impact: ${task.operationalImpact}
`).join('\n---\n')}

Provide a response in this exact JSON structure:
{
  "optimizedBlocks": [
    {
      "blockId": "string",
      "priority": "EMERGENCY|CRITICAL|HIGH|MEDIUM|ROUTINE",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "taskIds": ["array of task IDs grouped in this block"],
      "departments": ["array of departments"],
      "location": "string",
      "estimatedDuration": number,
      "requiredWorkers": number,
      "requiredEquipment": ["array"],
      "affectedPassengerTrains": number,
      "affectedGoodsTrains": number,
      "reasoning": "Why this window was selected and why these tasks were grouped"
    }
  ],
  "prioritizedTasks": [
    {
      "taskId": "string",
      "priorityLevel": "EMERGENCY|CRITICAL|HIGH|MEDIUM|ROUTINE",
      "priorityScore": number (1-100),
      "reasoning": "Why this priority was assigned"
    }
  ],
  "groupedTasks": [
    {
      "taskIds": ["array of compatible task IDs"],
      "reason": "Why these can be grouped",
      "estimatedSavings": "Time or resource savings from grouping"
    }
  ],
  "conflicts": [
    {
      "taskId": "string",
      "conflictType": "string",
      "description": "string"
    }
  ],
  "recommendations": [
    "string array of operational recommendations"
  ],
  "summary": {
    "totalBlocks": number,
    "criticalTasks": number,
    "tasksGrouped": number,
    "passengerTrainsAffected": number,
    "goodsTrainsAffected": number,
    "estimatedDowntime": "string"
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
        model: 'openai/gpt-oss-20b',
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

Be precise and transparent. Respond with valid JSON only.`
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

      return JSON.parse(response);
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error(`What-If analysis failed: ${error.message}`);
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
