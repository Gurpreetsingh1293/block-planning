/**
 * Block Planning Service Layer
 * Maintenance blocks, conflict detection, and AI optimization suggestions
 */
import { INITIAL_BLOCKS, CONFLICTS } from '../data/blocks';

let currentBlocksState = [...INITIAL_BLOCKS];

export async function getMaintenanceBlocks(filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...currentBlocksState];

      if (filters.department && filters.department !== 'All Departments') {
        filtered = filtered.filter((b) => b.department === filters.department);
      }

      if (filters.status && filters.status !== 'All Statuses') {
        filtered = filtered.filter((b) => b.status === filters.status);
      }

      if (filters.day && filters.day !== 'all') {
        filtered = filtered.filter((b) => b.day === filters.day);
      }

      resolve(filtered);
    }, 100);
  });
}

export async function getConflicts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(CONFLICTS);
    }, 100);
  });
}

export async function applyOptimization(conflictId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conflict = CONFLICTS.find((c) => c.id === conflictId);
      if (conflict && conflict.affectedBlockId) {
        currentBlocksState = currentBlocksState.map((block) => {
          if (block.id === conflict.affectedBlockId) {
            return {
              ...block,
              startTime: '13:00',
              endTime: '15:00',
              startHour: 13.0,
              durationHours: 2.0,
              status: 'Approved',
              isOptimized: true,
              optimizationNote: 'Shifted to 13:00–15:00 to eliminate freight conflict'
            };
          }
          return block;
        });
      }
      resolve({ success: true, updatedBlocks: currentBlocksState });
    }, 200);
  });
}

export async function resetBlocks() {
  currentBlocksState = [...INITIAL_BLOCKS];
  return Promise.resolve(currentBlocksState);
}
