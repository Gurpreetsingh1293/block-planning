import React from 'react';
import MaintenanceBlock from './MaintenanceBlock';
import FreightWindow from './FreightWindow';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../../data/blocks';
import { DEPARTMENT_THEMES } from '../../utils/statusHelpers';

export default function Timeline({
  blocks = [],
  conflicts = [],
  selectedDay = 'mon',
  onSelectDay,
  selectedBlock,
  onSelectBlock
}) {
  const departments = ['Engineering', 'S&T', 'TRD', 'Freight'];

  // Current day blocks
  const dayBlocks = blocks.filter((b) => b.day === selectedDay);

  // Check if conflict affects a block
  const isBlockInConflict = (block) => {
    return conflicts.some((c) => c.affectedBlockId === block.id);
  };

  return (
    <div className="planner-timeline-surface">
      {/* Day Selector Tabs (Monday - Friday) */}
      <div className="timeline-day-tabs">
        {DAYS_OF_WEEK.map((day) => {
          const isActive = selectedDay === day.key;
          const count = blocks.filter((b) => b.day === day.key).length;
          return (
            <button
              key={day.key}
              type="button"
              className={`day-tab-btn ${isActive ? 'day-tab-active' : ''}`}
              onClick={() => onSelectDay(day.key)}
            >
              <span className="day-name">{day.label}</span>
              <span className="day-date">{day.date}</span>
              {count > 0 && <span className="day-block-count">{count} blocks</span>}
            </button>
          );
        })}
      </div>

      {/* Main Calendar Grid Matrix */}
      <div className="timeline-grid-wrapper">
        {/* Time Scale Header Row */}
        <div className="timeline-header-row">
          <div className="row-dept-header-cell">Department / Stream</div>
          <div className="row-time-slots-scale">
            {TIME_SLOTS.map((slot) => (
              <div key={slot} className="time-scale-tick">
                <span className="tick-label">{slot}</span>
                <span className="tick-line" />
              </div>
            ))}
          </div>
        </div>

        {/* Department Timeline Rows */}
        <div className="timeline-rows-container">
          {departments.map((deptName) => {
            const deptInfo = DEPARTMENT_THEMES[deptName] || {};
            const deptRowBlocks = dayBlocks.filter((b) => b.department === deptName);

            return (
              <div key={deptName} className={`timeline-dept-row dept-row-${deptName.toLowerCase()}`}>
                {/* Left Department Tag Column */}
                <div className="dept-row-sidebar-cell">
                  <span
                    className="dept-row-color-bar"
                    style={{ backgroundColor: deptInfo.color }}
                  />
                  <div className="dept-row-title-wrap">
                    <span className="dept-row-title">{deptName}</span>
                    <span className="dept-row-sub">
                      {deptName === 'Freight' ? 'Cargo Movements' : 'Maintenance Window'}
                    </span>
                  </div>
                </div>

                {/* Right Interactive Track Slot Canvas */}
                <div className="dept-row-track-canvas">
                  {/* Background grid vertical guidelines */}
                  <div className="track-grid-guides">
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot} className="track-guide-col" />
                    ))}
                  </div>

                  {/* Render blocks or freight rakes inside this lane */}
                  <div className="track-blocks-layer">
                    {deptName === 'Freight'
                      ? deptRowBlocks.map((fBlock) => (
                          <FreightWindow
                            key={fBlock.id}
                            freightBlock={fBlock}
                            isSelected={selectedBlock?.id === fBlock.id}
                            onClick={onSelectBlock}
                          />
                        ))
                      : deptRowBlocks.map((block) => (
                          <MaintenanceBlock
                            key={block.id}
                            block={block}
                            isSelected={selectedBlock?.id === block.id}
                            hasConflict={isBlockInConflict(block)}
                            onClick={onSelectBlock}
                          />
                        ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
