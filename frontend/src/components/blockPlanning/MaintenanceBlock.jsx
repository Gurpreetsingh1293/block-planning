import React from 'react';
import { DEPARTMENT_THEMES, STATUS_COLORS } from '../../utils/statusHelpers';
import { Sparkles, Users, Wrench, Clock, CheckCircle } from 'lucide-react';

export default function MaintenanceBlock({
  block,
  isSelected,
  onClick,
  hasConflict = false
}) {
  const deptTheme = DEPARTMENT_THEMES[block.department] || DEPARTMENT_THEMES['Engineering'];
  const statusCfg = STATUS_COLORS[block.status] || { text: '#003B73' };

  // Timeline starts at 06:00 (6.0) and ends at 19:00 (13 hours total)
  const timelineStartHour = 6.0;
  const timelineTotalHours = 13.0; // 06:00 to 19:00

  const leftPercent = Math.max(0, ((block.startHour - timelineStartHour) / timelineTotalHours) * 100);
  const widthPercent = Math.min(100 - leftPercent, (block.durationHours / timelineTotalHours) * 100);

  return (
    <div
      className={`maintenance-block-pill ${isSelected ? 'block-selected' : ''} ${hasConflict ? 'block-in-conflict' : ''} ${block.isOptimized ? 'block-optimized-state' : ''}`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: deptTheme.bg,
        borderColor: hasConflict ? '#C62828' : block.isOptimized ? '#0284C7' : deptTheme.border
      }}
      onClick={() => onClick(block)}
      title={`${block.department} - ${block.title} (${block.startTime}–${block.endTime})`}
    >
      <div className="block-pill-header">
        <div className="block-tag-wrap">
          <span
            className="block-dept-tag"
            style={{ color: deptTheme.color }}
          >
            {deptTheme.tag}
          </span>
          <span className="block-time-range">{block.startTime}–{block.endTime}</span>
        </div>

        {block.isOptimized && (
          <span className="optimized-sparkle-pill" title="Optimized via AI">
            <Sparkles size={10} />
            <span>AI OPT</span>
          </span>
        )}
      </div>

      <div className="block-pill-title">{block.title}</div>

      <div className="block-pill-footer">
        <span className="block-status-indicator" style={{ color: statusCfg.text }}>
          {block.status}
        </span>
        {block.coordinatedWith?.length > 0 && (
          <span className="block-joint-indicator">
            +{block.coordinatedWith.length} Joint
          </span>
        )}
      </div>
    </div>
  );
}
