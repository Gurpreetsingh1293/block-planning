/**
 * Data Preprocessor - Deterministic Filtering & Normalization
 * 
 * This layer filters and normalizes data BEFORE sending to AI.
 * The LLM should act as a reasoning engine, NOT a database query engine.
 * 
 * Deterministic operations handled here:
 * - Filtering by section, corridor, date
 * - Time window calculations
 * - Train conflict detection
 * - Duration calculations
 * - Availability checks
 * 
 * AI operations (handled by Groq):
 * - Prioritization reasoning
 * - Task grouping suggestions
 * - Optimization recommendations
 * - Human-readable explanations
 */

export class DataPreprocessor {
  /**
   * Filter railway timetable by section and date
   */
  static filterTimetableBySection(trains, section, date = null) {
    return trains.filter(train => {
      const sectionMatch = train.section === section;
      // Date filtering can be added when date is part of train data
      return sectionMatch;
    });
  }

  /**
   * Filter goods trains by section and date
   */
  static filterGoodsBySection(goodsTrains, section, date = null) {
    return goodsTrains.filter(goods => {
      return goods.section === section;
    });
  }

  /**
   * Filter maintenance tasks by section/corridor
   */
  static filterMaintenanceBySection(tasks, section) {
    return tasks.filter(task => {
      return task.section === section || task.location.includes(section);
    });
  }

  /**
   * Parse time string to minutes since midnight
   */
  static timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convert minutes to time string
   */
  static minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Calculate time difference in minutes
   */
  static getTimeDifferenceMinutes(startTime, endTime) {
    let startMinutes = this.timeToMinutes(startTime);
    let endMinutes = this.timeToMinutes(endTime);
    
    // Handle overnight windows
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    return endMinutes - startMinutes;
  }

  /**
   * Check if time is within window
   */
  static isTimeInWindow(time, windowStart, windowEnd) {
    let timeMinutes = this.timeToMinutes(time);
    let startMinutes = this.timeToMinutes(windowStart);
    let endMinutes = this.timeToMinutes(windowEnd);
    
    // Handle overnight windows
    if (endMinutes < startMinutes) {
      return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
    }
    
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  }

  /**
   * Find trains that would be affected by a block window
   * This is a DETERMINISTIC calculation, not an AI task
   */
  static findAffectedTrains(blockStart, blockEnd, trains) {
    const affected = [];
    
    trains.forEach(train => {
      if (!train.stations || train.stations.length === 0) return;
      
      const firstStation = train.stations[0];
      const lastStation = train.stations[train.stations.length - 1];
      
      const departure = firstStation?.departureTime;
      const arrival = lastStation?.arrivalTime;
      
      if (!departure) return;
      
      // Check if any part of train journey overlaps with block window
      const trainInBlock = 
        this.isTimeInWindow(departure, blockStart, blockEnd) ||
        (arrival && this.isTimeInWindow(arrival, blockStart, blockEnd));
      
      if (trainInBlock) {
        affected.push({
          trainNumber: train.trainNumber,
          trainName: train.trainName,
          trainType: train.trainType,
          departure,
          arrival,
          priority: train.priority
        });
      }
    });
    
    return affected;
  }

  /**
   * Calculate window suitability score (deterministic)
   */
  static calculateWindowSuitability(window, requiredDurationHours, passengerTrains, goodsTrains) {
    let score = 100;
    
    // Check if window is long enough
    const windowDuration = this.getTimeDifferenceMinutes(window.availableFrom, window.availableUntil);
    const requiredMinutes = requiredDurationHours * 60;
    
    if (windowDuration < requiredMinutes) {
      return 0; // Window too short - hard constraint
    }
    
    // Reduce score based on traffic density (deterministic factor)
    if (window.trafficDensity === 'High') {
      score -= 40;
    } else if (window.trafficDensity === 'Medium') {
      score -= 20;
    }
    
    // Check for passenger train conflicts (hard constraint penalty)
    const affectedPassenger = this.findAffectedTrains(
      window.availableFrom,
      window.availableUntil,
      passengerTrains
    );
    
    // Passenger trains are HARD CONSTRAINTS
    if (affectedPassenger.length > 0) {
      score -= affectedPassenger.length * 50;
    }
    
    // Check for goods train conflicts (soft constraint)
    const affectedGoods = this.findAffectedTrains(
      window.availableFrom,
      window.availableUntil,
      goodsTrains
    );
    
    score -= affectedGoods.length * 15;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Find compatible maintenance tasks (spatial and temporal compatibility)
   */
  static findCompatibleTasks(tasks) {
    const compatible = [];
    
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const task1 = tasks[i];
        const task2 = tasks[j];
        
        // Check spatial compatibility
        const sameCorridor = task1.corridor === task2.corridor;
        const sameSection = task1.section === task2.section;
        
        // Check if both require blocks
        const bothRequireBlock = task1.blockRequired && task2.blockRequired;
        
        // Check duration compatibility (within 1 hour difference)
        const durationDiff = Math.abs(task1.estimatedDuration - task2.estimatedDuration);
        const durationCompatible = durationDiff <= 1;
        
        // Check if equipment is compatible (no conflicts)
        const equipmentConflict = this.checkEquipmentConflict(task1, task2);
        
        if (sameCorridor && sameSection && bothRequireBlock && durationCompatible && !equipmentConflict) {
          compatible.push({
            task1Id: task1.taskId,
            task2Id: task2.taskId,
            reason: 'Same corridor, compatible duration, no equipment conflict',
            combinedDuration: Math.max(task1.estimatedDuration, task2.estimatedDuration) + 0.5,
            combinedWorkers: task1.requiredWorkers + task2.requiredWorkers
          });
        }
      }
    }
    
    return compatible;
  }

  /**
   * Check if two tasks have equipment conflicts
   */
  static checkEquipmentConflict(task1, task2) {
    // For now, assume no conflicts if equipment is different
    // In production, this would check for mutually exclusive equipment
    return false;
  }

  /**
   * Identify available windows that can accommodate a task
   */
  static findSuitableWindows(task, corridorAvailability, passengerTrains, goodsTrains) {
    const suitableWindows = [];
    
    corridorAvailability.forEach(window => {
      const suitability = this.calculateWindowSuitability(
        window,
        task.estimatedDuration,
        passengerTrains,
        goodsTrains
      );
      
      if (suitability > 0) {
        const affectedPassenger = this.findAffectedTrains(
          window.availableFrom,
          window.availableUntil,
          passengerTrains
        );
        
        const affectedGoods = this.findAffectedTrains(
          window.availableFrom,
          window.availableUntil,
          goodsTrains
        );
        
        suitableWindows.push({
          window,
          suitability,
          affectedPassengerTrains: affectedPassenger.length,
          affectedGoodsTrains: affectedGoods.length,
          windowDuration: this.getTimeDifferenceMinutes(window.availableFrom, window.availableUntil) / 60
        });
      }
    });
    
    // Sort by suitability descending
    suitableWindows.sort((a, b) => b.suitability - a.suitability);
    
    return suitableWindows;
  }

  /**
   * Build preprocessed dataset for AI optimization (SIMPLIFIED for token limits)
   * This is the clean, filtered dataset that goes to the LLM
   */
  static buildOptimizationDataset(rawData) {
    const {
      maintenanceTasks,
      passengerTrains,
      goodsTrains,
      corridorAvailability,
      corridorInfo,
      section = 'Delhi-Mathura',
      date = '2026-09-11'
    } = rawData;

    // Filter data by section (deterministic)
    const filteredPassengerTrains = this.filterTimetableBySection(passengerTrains, section, date);
    const filteredGoodsTrains = this.filterGoodsBySection(goodsTrains, section, date);
    const filteredMaintenanceTasks = this.filterMaintenanceBySection(maintenanceTasks, section);

    // ✅ SIMPLIFIED: Only send essential fields to avoid token limits
    const simplifiedTasks = filteredMaintenanceTasks.map(task => ({
      taskId: task.taskId,
      department: task.department,
      location: task.location || task.section,
      defect: task.defect ? task.defect.substring(0, 80) : 'Maintenance required',  // Truncate long descriptions
      criticality: task.criticality,
      urgency: task.urgency,
      estimatedDuration: task.estimatedDuration,
      requiredWorkers: task.requiredWorkers,
      requiredEquipment: task.requiredEquipment || [],
      section: task.section
    }));

    // ✅ SIMPLIFIED: Only essential train data
    const simplifiedPassengerTrains = filteredPassengerTrains.slice(0, 10).map(train => ({  // Limit to 10 trains
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      trainType: train.trainType,
      stations: train.stations ? [
        train.stations[0],  // First station
        train.stations[train.stations.length - 1]  // Last station
      ] : []
    }));

    // ✅ SIMPLIFIED: Only essential goods train data
    const simplifiedGoodsTrains = filteredGoodsTrains.slice(0, 5).map(goods => ({  // Limit to 5 trains
      trainNumber: goods.trainNumber,
      trainName: goods.trainName,
      expectedDeparture: goods.expectedDeparture,
      expectedArrival: goods.expectedArrival
    }));

    // Build summary statistics (deterministic)
    const summary = {
      totalMaintenanceTasks: simplifiedTasks.length,
      criticalTasks: simplifiedTasks.filter(t => t.criticality === 'Critical' || t.urgency === 'Emergency').length,
      totalPassengerTrains: simplifiedPassengerTrains.length,
      totalGoodsTrains: simplifiedGoodsTrains.length,
      availableWindows: corridorAvailability.length
    };

    return {
      maintenanceTasks: simplifiedTasks,
      passengerTrains: simplifiedPassengerTrains,
      goodsTrains: simplifiedGoodsTrains,
      corridorAvailability: corridorAvailability,
      corridorInfo: corridorInfo,
      summary,
      metadata: {
        section,
        date,
        preprocessedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Validate block request data
   */
  static validateBlockRequest(block) {
    const errors = [];

    if (!block.startTime || !block.endTime) {
      errors.push('Start time and end time are required');
    }

    if (block.startTime && block.endTime) {
      const duration = this.getTimeDifferenceMinutes(block.startTime, block.endTime);
      if (duration <= 0) {
        errors.push('End time must be after start time');
      }
      if (duration > 8 * 60) {
        errors.push('Block duration cannot exceed 8 hours');
      }
    }

    if (!block.department) {
      errors.push('Department is required');
    }

    if (!block.location) {
      errors.push('Location is required');
    }

    if (block.requiredWorkers && block.requiredWorkers < 1) {
      errors.push('At least 1 worker is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default DataPreprocessor;
