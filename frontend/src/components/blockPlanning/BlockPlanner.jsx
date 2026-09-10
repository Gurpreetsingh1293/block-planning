import React, { useMemo } from 'react';
import CalendarHeader from './CalendarHeader';
import DepartmentPanel from './DepartmentPanel';
import TaskStatusFilter from './TaskStatusFilter';
import Timeline from './Timeline';
import ConflictAlert from './ConflictAlert';
import OptimizationSuggestion from './OptimizationSuggestion';
import { useBlockPlanning } from '../../hooks/useBlockPlanning';
import { Clock, MapPin, Wrench, Users, Info, ShieldCheck, X } from 'lucide-react';
import StatusPill from '../common/StatusPill';

export default function BlockPlanner() {
  const {
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
    applyOptimization,
    resetSchedule
  } = useBlockPlanning();

  // Compute counts for filters
  const deptCounts = useMemo(() => {
    const counts = { 'All Departments': blocks.length };
    blocks.forEach((b) => {
      counts[b.department] = (counts[b.department] || 0) + 1;
    });
    return counts;
  }, [blocks]);

  const statusCounts = useMemo(() => {
    const counts = { 'All Statuses': blocks.length };
    blocks.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return counts;
  }, [blocks]);

  const activeConflict = conflicts.length > 0 ? conflicts[0] : null;

  return (
    <div className="block-planner-full-workspace">
      {/* 1. Planner Calendar Top Bar */}
      <CalendarHeader
        onOptimize={() => applyOptimization('conf-1')}
        onReset={resetSchedule}
        optimizing={optimizing}
        optimizationApplied={optimizationApplied}
      />

      {/* 2. Conflict Alert Banner (If active conflict exists) */}
      {activeConflict && !optimizationApplied && (
        <ConflictAlert
          conflict={activeConflict}
          onApplyOptimization={applyOptimization}
          optimizing={optimizing}
        />
      )}

      {/* 3. Main Full-Width Split Layout: Filter Panel (Left) + Master Timeline (Right) */}
      <div className="planner-main-layout">
        {/* Left Filter Side Panel */}
        <aside className="planner-filter-sidebar">
          <DepartmentPanel
            selectedDept={selectedDept}
            onSelectDept={setSelectedDept}
            deptCounts={deptCounts}
          />

          <div className="filter-panel-divider" />

          <TaskStatusFilter
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            statusCounts={statusCounts}
          />

          {/* AI Optimization Insight Widget */}
          <div className="filter-panel-divider" />
          <OptimizationSuggestion
            conflict={activeConflict}
            onApply={() => applyOptimization('conf-1')}
            optimizing={optimizing}
            applied={optimizationApplied}
          />
        </aside>

        {/* Right Master Timeline Workspace (Takes all remaining width) */}
        <div className="planner-timeline-main-area">
          <Timeline
            blocks={blocks}
            conflicts={conflicts}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            selectedBlock={selectedBlock}
            onSelectBlock={setSelectedBlock}
          />

          {/* Selected Task Inspector Details */}
          {selectedBlock && (
            <div className="block-inspector-card">
              <div className="inspector-header">
                <div className="inspector-title-group">
                  <span className="inspector-dept-badge">{selectedBlock.department}</span>
                  <h3 className="inspector-title">{selectedBlock.title}</h3>
                </div>

                <div className="inspector-actions">
                  <StatusPill status={selectedBlock.status} />
                  <button
                    type="button"
                    className="inspector-close-btn"
                    onClick={() => setSelectedBlock(null)}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div className="inspector-grid">
                <div className="inspector-item">
                  <span className="inspector-label">
                    <MapPin size={13} /> Corridor Section:
                  </span>
                  <span className="inspector-val">{selectedBlock.section}</span>
                </div>

                <div className="inspector-item">
                  <span className="inspector-label">
                    <Clock size={13} /> Scheduled Slot:
                  </span>
                  <span className="inspector-val highlight-time">
                    {selectedBlock.startTime} – {selectedBlock.endTime} ({selectedBlock.durationHours} hrs)
                  </span>
                </div>

                <div className="inspector-item">
                  <span className="inspector-label">
                    <Users size={13} /> Gang & Resources:
                  </span>
                  <span className="inspector-val">{selectedBlock.gangStrength || 'Authorized P-Way Staff'}</span>
                </div>

                <div className="inspector-item">
                  <span className="inspector-label">
                    <Wrench size={13} /> Machinery Deployed:
                  </span>
                  <span className="inspector-val">{selectedBlock.machineType || 'Standard Inspection Rig'}</span>
                </div>
              </div>

              {selectedBlock.description && (
                <div className="inspector-desc-box">
                  <strong>Work Description:</strong> {selectedBlock.description}
                </div>
              )}

              {selectedBlock.optimizationNote && (
                <div className="inspector-opt-note">
                  <ShieldCheck size={14} className="text-accent-cyan" />
                  <span>{selectedBlock.optimizationNote}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
