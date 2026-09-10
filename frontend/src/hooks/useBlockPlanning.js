import { useState, useEffect, useCallback } from 'react';
import { getMaintenanceBlocks, getConflicts, applyOptimization, resetBlocks } from '../services/blockService';

export function useBlockPlanning() {
  const [blocks, setBlocks] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedDay, setSelectedDay] = useState('mon');
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  const loadBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const [blockList, conflictList] = await Promise.all([
        getMaintenanceBlocks({
          department: selectedDept,
          status: selectedStatus
        }),
        getConflicts()
      ]);
      setBlocks(blockList);
      setConflicts(conflictList);

      if (blockList.length > 0 && !selectedBlock) {
        setSelectedBlock(blockList[0]);
      }
    } catch (err) {
      console.error('Error in useBlockPlanning:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDept, selectedStatus, selectedBlock]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  const handleApplyOptimization = async (conflictId = 'conf-1') => {
    setOptimizing(true);
    try {
      const res = await applyOptimization(conflictId);
      if (res.success) {
        setOptimizationApplied(true);
        // Refresh blocks
        const updated = await getMaintenanceBlocks({
          department: selectedDept,
          status: selectedStatus
        });
        setBlocks(updated);
        // Remove or clear resolved conflict
        setConflicts([]);
      }
    } catch (err) {
      console.error('Failed to apply optimization:', err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleReset = async () => {
    await resetBlocks();
    setOptimizationApplied(false);
    loadBlocks();
  };

  return {
    blocks,
    conflicts,
    selectedDept,
    setSelectedDept,
    selectedStatus,
    setSelectedStatus,
    selectedDay,
    setSelectedDay,
    selectedBlock,
    setSelectedBlock,
    loading,
    optimizing,
    optimizationApplied,
    applyOptimization: handleApplyOptimization,
    resetSchedule: handleReset,
    refetch: loadBlocks
  };
}
