import React from 'react';
import { AlertOctagon, Package } from 'lucide-react';

export default function FreightWindow({
  freightBlock,
  isSelected,
  onClick
}) {
  const timelineStartHour = 6.0;
  const timelineTotalHours = 13.0; // 06:00 to 19:00

  const leftPercent = Math.max(0, ((freightBlock.startHour - timelineStartHour) / timelineTotalHours) * 100);
  const widthPercent = Math.min(100 - leftPercent, (freightBlock.durationHours / timelineTotalHours) * 100);

  return (
    <div
      className={`freight-window-pill ${isSelected ? 'freight-selected' : ''}`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`
      }}
      onClick={() => onClick(freightBlock)}
      title={`${freightBlock.title} (${freightBlock.startTime}–${freightBlock.endTime})`}
    >
      <div className="freight-pill-header">
        <div className="freight-tag-group">
          <Package size={11} className="text-accent-red" />
          <span className="freight-code">FREIGHT</span>
          <span className="freight-time">{freightBlock.startTime}–{freightBlock.endTime}</span>
        </div>
        <span className="freight-heavy-badge">HEAVY RAKE</span>
      </div>

      <div className="freight-pill-title">{freightBlock.title}</div>
      <div className="freight-pill-section">{freightBlock.section}</div>
    </div>
  );
}
