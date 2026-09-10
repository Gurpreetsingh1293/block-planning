import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplayTime, getEngineerName, BLOCK_COLORS } from '../../utils/timeHelpers';

/**
 * Floating Hover Tooltip
 * Appears on ANY block hover (Available or Occupied)
 * Includes viewport collision detection to prevent overflow
 */
export default function BlockTooltip({ block, anchorRect, visible }) {
  if (!block || !anchorRect) return null;

  const TOOLTIP_WIDTH = 300;
  const TOOLTIP_EST_HEIGHT = 240;
  const OFFSET = 12;

  // Viewport collision detection
  let left = anchorRect.right + OFFSET;
  let top = anchorRect.top;

  // Flip to left side if overflows right edge
  if (left + TOOLTIP_WIDTH > window.innerWidth - 16) {
    left = anchorRect.left - TOOLTIP_WIDTH - OFFSET;
  }

  // Clamp vertically so tooltip never goes off-screen
  if (top + TOOLTIP_EST_HEIGHT > window.innerHeight - 16) {
    top = window.innerHeight - TOOLTIP_EST_HEIGHT - 16;
  }
  if (top < 8) top = 8;

  const isAvailable = block.status === 'Available';
  const colors = BLOCK_COLORS[block.colorKey] || BLOCK_COLORS.white;
  const engineerName = getEngineerName(block);
  const startDisplay = formatDisplayTime(block.startTime);
  const endDisplay = formatDisplayTime(block.endTime);

  const durationLabel =
    block.duration
      ? String(block.duration)
      : block.durationMinutes
      ? `${block.durationMinutes} min`
      : '';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="block-tooltip"
          initial={{ opacity: 0, scale: 0.94, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: `${left}px`,
            top: `${top}px`,
            width: `${TOOLTIP_WIDTH}px`,
            zIndex: 80,
            pointerEvents: 'none',
            borderRadius: '10px',
            background: '#fff',
            boxShadow: '0 8px 32px rgba(0,26,51,0.22), 0 2px 8px rgba(0,0,0,0.1)',
            border: `1.5px solid ${isAvailable ? '#3B82F6' : colors.border}`,
            overflow: 'hidden',
          }}
        >
          {/* Colored top bar */}
          <div
            style={{
              background: isAvailable ? '#EFF6FF' : colors.bg,
              borderBottom: `1px solid ${isAvailable ? '#BFDBFE' : colors.border}`,
              padding: '10px 14px 8px',
            }}
          >
            {/* Title + Slot ID row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: isAvailable ? '#1e40af' : colors.text, lineHeight: 1.3 }}>
                {block.title}
              </div>
              <div style={{ fontSize: 10, color: '#64748b', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                {block.slotId}
              </div>
            </div>

            {/* Status badge */}
            <div style={{ marginTop: 5, display: 'flex', gap: 6, alignItems: 'center' }}>
              {isAvailable ? (
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                  border: '1px solid #86efac',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#16a34a',
                    animation: 'pulse 1.5s infinite',
                    display: 'inline-block',
                  }} />
                  Available
                </span>
              ) : (
                <span style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                  border: '1px solid #fcd34d',
                }}>
                  🔒 Interlocked
                </span>
              )}
              {block.deptTag && (
                <span style={{
                  background: isAvailable ? '#dbeafe' : colors.bg,
                  color: isAvailable ? '#1d4ed8' : colors.text,
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 20,
                  border: `1px solid ${isAvailable ? '#93c5fd' : colors.border}`,
                }}>
                  {block.deptTag}
                </span>
              )}
            </div>
          </div>

          {/* Tooltip body */}
          <div style={{ padding: '10px 14px 12px', fontSize: 12, color: '#374151' }}>
            {/* In-Charge / JE */}
            <TooltipRow
              icon="👷"
              label={isAvailable ? 'Open for' : 'In-Charge / JE'}
              value={isAvailable ? 'Junior Engineer (Booking Open)' : engineerName}
            />

            {/* Department */}
            <TooltipRow
              icon="🏢"
              label="Department"
              value={block.department || 'All Departments'}
            />

            {/* Time Window */}
            <TooltipRow
              icon="🕐"
              label="Time Window"
              value={`${startDisplay} – ${endDisplay}${durationLabel ? ` · ${durationLabel}` : ''}`}
            />

            {/* Track */}
            {block.track && (
              <TooltipRow
                icon="🛤️"
                label="Track"
                value={block.track}
              />
            )}

            {/* Section */}
            {block.section && (
              <TooltipRow
                icon="📍"
                label="Section"
                value={block.section}
              />
            )}

            {/* Remarks / Description */}
            {block.description && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Remarks
                </div>
                <div style={{ color: '#374151', lineHeight: 1.4 }}>
                  {block.description}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TooltipRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
      <span style={{ flexShrink: 0, fontSize: 12 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}:{' '}
        </span>
        <span style={{ color: '#1f2937', fontWeight: 500 }}>{value}</span>
      </div>
    </div>
  );
}
