import React from 'react';
import Button from '../common/Button';
import { Calendar, Sparkles, RefreshCw, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function CalendarHeader({
  dateRange = '07 Sep 2026 – 11 Sep 2026',
  onOptimize,
  onReset,
  optimizing,
  optimizationApplied
}) {
  return (
    <div className="planner-calendar-header">
      {/* Title & Division Info */}
      <div className="planner-title-block">
        <div className="planner-badge-wrap">
          <span className="planner-corridor-tag">Coordinated Master Corridor</span>
          <span className="planner-div-tag">Northern Railway • Delhi Div</span>
        </div>
        <h2 className="planner-main-title">Division Maintenance Schedule Planner</h2>
      </div>

      {/* Date Range Navigation & Optimization Controls */}
      <div className="planner-controls-right">
        {/* Date Range Selector */}
        <div className="date-range-stepper">
          <button className="stepper-nav-btn" title="Previous Week">
            <ChevronLeft size={16} />
          </button>
          <div className="stepper-display">
            <Calendar size={14} className="text-accent-blue" />
            <span className="range-text">{dateRange}</span>
          </div>
          <button className="stepper-nav-btn" title="Next Week">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* AI Optimizer Action Button */}
        <Button
          variant={optimizationApplied ? 'success' : 'primary'}
          size="md"
          icon={optimizationApplied ? RefreshCw : Sparkles}
          onClick={optimizationApplied ? onReset : onOptimize}
          disabled={optimizing}
          className="optimizer-trigger-btn"
        >
          {optimizing
            ? 'Analyzing Conflicts...'
            : optimizationApplied
            ? 'Reset to Original'
            : 'Run AI Optimizer'}
        </Button>
      </div>
    </div>
  );
}
