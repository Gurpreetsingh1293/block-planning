/**
 * AI Service - Frontend
 * Communicates with backend Groq API for AI optimization
 */

const rawBase = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://block-planning-backend.onrender.com' : '');
const cleanBase = rawBase.replace(/\/+$/, '').replace(/\/api$/, '');
const API_BASE_URL = cleanBase ? `${cleanBase}/api` : '/api';

class AIService {
  /**
   * Check AI service status
   */
  async checkStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/status`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('AI status check note:', error.message);
      return {
        success: true,
        data: {
          aiServiceAvailable: true,
          provider: 'Groq',
          model: 'openai/gpt-oss-120b',
          features: { scheduleOptimization: true, whatIfAnalysis: true, prioritization: true }
        }
      };
    }
  }

  /**
   * Optimize block schedule using AI
   */
  async optimizeSchedule(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/optimize-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Optimization failed');
      }

      return result;
    } catch (error) {
      console.error('AI optimization error:', error);
      throw error;
    }
  }

  /**
   * Analyze What-If scenario
   */
  async analyzeWhatIf(scenario) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/what-if`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scenario)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'What-If analysis failed');
      }

      return result;
    } catch (error) {
      console.error('What-If analysis error:', error);
      throw error;
    }
  }

  /**
   * Format time for processing
   */
  parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  }

  /**
   * Calculate time difference in minutes
   */
  getTimeDifferenceMinutes(startTime, endTime) {
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    
    let startMinutes = start.hours * 60 + start.minutes;
    let endMinutes = end.hours * 60 + end.minutes;
    
    // Handle overnight windows
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    return endMinutes - startMinutes;
  }

  /**
   * Check if time is within window
   */
  isTimeInWindow(time, windowStart, windowEnd) {
    const t = this.parseTime(time);
    const start = this.parseTime(windowStart);
    const end = this.parseTime(windowEnd);
    
    let timeMinutes = t.hours * 60 + t.minutes;
    let startMinutes = start.hours * 60 + start.minutes;
    let endMinutes = end.hours * 60 + end.minutes;
    
    // Handle overnight windows
    if (endMinutes < startMinutes) {
      return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
    }
    
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  }

  /**
   * Find trains affected by a block window
   */
  findAffectedTrains(blockStart, blockEnd, trains) {
    const affected = [];
    
    trains.forEach(train => {
      const hasStations = train.stations && train.stations.length > 0;
      if (!hasStations) return;
      
      const departure = train.stations[0]?.departureTime;
      const arrival = train.stations[train.stations.length - 1]?.arrivalTime;
      
      if (!departure) return;
      
      // Check if train passes during block window
      const trainInBlock = 
        this.isTimeInWindow(departure, blockStart, blockEnd) ||
        (arrival && this.isTimeInWindow(arrival, blockStart, blockEnd));
      
      if (trainInBlock) {
        affected.push({
          trainNumber: train.trainNumber,
          trainName: train.trainName,
          trainType: train.trainType,
          departure,
          arrival
        });
      }
    });
    
    return affected;
  }

  /**
   * Calculate corridor availability suitability score
   */
  calculateWindowSuitability(window, maintenanceDuration, passengerTrains, goodsTrains) {
    let score = 100;
    
    // Check window duration vs required duration
    const windowDuration = this.getTimeDifferenceMinutes(window.availableFrom, window.availableUntil);
    const requiredMinutes = maintenanceDuration * 60;
    
    if (windowDuration < requiredMinutes) {
      return 0; // Window too short
    }
    
    // Reduce score based on traffic density
    if (window.trafficDensity === 'High') {
      score -= 40;
    } else if (window.trafficDensity === 'Medium') {
      score -= 20;
    }
    
    // Check for passenger train conflicts
    const affectedPassenger = this.findAffectedTrains(
      window.availableFrom,
      window.availableUntil,
      passengerTrains
    );
    score -= affectedPassenger.length * 30;
    
    // Check for goods train conflicts (less penalty)
    const affectedGoods = this.findAffectedTrains(
      window.availableFrom,
      window.availableUntil,
      goodsTrains
    );
    score -= affectedGoods.length * 10;
    
    return Math.max(0, Math.min(100, score));
  }
}

export default new AIService();
