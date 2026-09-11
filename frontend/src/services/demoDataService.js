/**
 * Demo Data Service
 * Manages temporary structured data for AI Engine demonstration
 * Provides persistence through localStorage until backend integration
 */

import maintenanceData from '../data/demoMaintenanceData.json';
import railwayTimetable from '../data/demoRailwayTimetable.json';
import goodsForecast from '../data/demoGoodsForecast.json';
import corridorData from '../data/demoCorridorData.json';
import blockRequests from '../data/demoBlockRequests.json';

const STORAGE_KEYS = {
  MAINTENANCE: 'railway_maintenance_tasks',
  BLOCKS: 'railway_block_requests',
  GOODS: 'railway_goods_forecast',
  CORRIDORS: 'railway_corridor_availability'
};

class DemoDataService {
  constructor() {
    this.initializeData();
  }

  /**
   * Initialize data from JSON files and sync with localStorage
   */
  initializeData() {
    // Initialize maintenance tasks if not in localStorage
    if (!localStorage.getItem(STORAGE_KEYS.MAINTENANCE)) {
      this.saveMaintenanceTasks(maintenanceData.maintenanceTasks);
    }

    // Initialize block requests if not in localStorage
    if (!localStorage.getItem(STORAGE_KEYS.BLOCKS)) {
      this.saveBlockRequests(blockRequests.blocks);
    }

    // Initialize goods forecast
    if (!localStorage.getItem(STORAGE_KEYS.GOODS)) {
      localStorage.setItem(STORAGE_KEYS.GOODS, JSON.stringify(goodsForecast.goodsTrains));
    }

    // Initialize corridor availability
    if (!localStorage.getItem(STORAGE_KEYS.CORRIDORS)) {
      localStorage.setItem(STORAGE_KEYS.CORRIDORS, JSON.stringify(corridorData));
    }
  }

  /**
   * Get all maintenance tasks
   */
  getMaintenanceTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      return stored ? JSON.parse(stored) : maintenanceData.maintenanceTasks;
    } catch (error) {
      console.error('Error loading maintenance tasks:', error);
      return maintenanceData.maintenanceTasks;
    }
  }

  /**
   * Save maintenance tasks
   */
  saveMaintenanceTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving maintenance tasks:', error);
      return false;
    }
  }

  /**
   * Add a new maintenance task
   */
  addMaintenanceTask(task) {
    const tasks = this.getMaintenanceTasks();
    const newTask = {
      ...task,
      taskId: `${task.department.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    tasks.push(newTask);
    this.saveMaintenanceTasks(tasks);
    return newTask;
  }

  /**
   * Get all block requests
   */
  getBlockRequests() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      return stored ? JSON.parse(stored) : blockRequests.blocks;
    } catch (error) {
      console.error('Error loading block requests:', error);
      return blockRequests.blocks;
    }
  }

  /**
   * Save block requests
   */
  saveBlockRequests(blocks) {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
      return true;
    } catch (error) {
      console.error('Error saving block requests:', error);
      return false;
    }
  }

  /**
   * Add a new block request
   */
  addBlockRequest(block) {
    const blocks = this.getBlockRequests();
    const blockCount = blocks.length + 1;
    const newBlock = {
      ...block,
      blockId: `BLOCK-${String(blockCount).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      approvedBy: null
    };
    blocks.push(newBlock);
    this.saveBlockRequests(blocks);
    return newBlock;
  }

  /**
   * Update block request
   */
  updateBlockRequest(blockId, updates) {
    const blocks = this.getBlockRequests();
    const index = blocks.findIndex(b => b.blockId === blockId);
    if (index !== -1) {
      blocks[index] = { ...blocks[index], ...updates };
      this.saveBlockRequests(blocks);
      return blocks[index];
    }
    return null;
  }

  /**
   * Get railway timetable (read-only from JSON)
   */
  getRailwayTimetable() {
    return railwayTimetable.trains;
  }

  /**
   * Get goods train forecast
   */
  getGoodsForecast() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOODS);
      return stored ? JSON.parse(stored) : goodsForecast.goodsTrains;
    } catch (error) {
      console.error('Error loading goods forecast:', error);
      return goodsForecast.goodsTrains;
    }
  }

  /**
   * Get corridor data
   */
  getCorridorData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CORRIDORS);
      return stored ? JSON.parse(stored) : corridorData;
    } catch (error) {
      console.error('Error loading corridor data:', error);
      return corridorData;
    }
  }

  /**
   * Get corridor availability for a specific date
   */
  getCorridorAvailability(corridorId, date) {
    const data = this.getCorridorData();
    const availability = data.availability.find(
      a => a.corridorId === corridorId && a.date === date
    );
    return availability ? availability.windows : [];
  }

  /**
   * Filter railway timetable by section and date
   * This is the deterministic preprocessing layer before AI
   */
  filterTimetableBySection(section, date = null) {
    const trains = this.getRailwayTimetable();
    return trains.filter(train => train.section === section);
  }

  /**
   * Get all data for AI Engine processing
   */
  getAIEngineData(section = 'Delhi-Mathura', corridorId = 'C-01', date = '2026-09-11') {
    return {
      maintenanceTasks: this.getMaintenanceTasks(),
      blockRequests: this.getBlockRequests(),
      passengerTrains: this.filterTimetableBySection(section, date),
      goodsTrains: this.getGoodsForecast(),
      corridorAvailability: this.getCorridorAvailability(corridorId, date),
      corridorInfo: this.getCorridorData().corridors.find(c => c.corridorId === corridorId)
    };
  }

  /**
   * Reset to default demo data
   */
  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(STORAGE_KEYS.BLOCKS);
    localStorage.removeItem(STORAGE_KEYS.GOODS);
    localStorage.removeItem(STORAGE_KEYS.CORRIDORS);
    this.initializeData();
  }
}

// Export singleton instance
export default new DemoDataService();
