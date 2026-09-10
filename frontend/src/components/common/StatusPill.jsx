import React from 'react';
import { STATUS_COLORS } from '../../utils/statusHelpers';

export default function StatusPill({ status, className = '' }) {
  const config = STATUS_COLORS[status] || STATUS_COLORS['Requested'];
  const isOk = status === 'ON TIME' || status === 'OPTIMIZED' || status === 'Completed' || status === 'Approved';
  const isDelayed = status?.includes('DELAYED') || status === 'CONFLICT';

  return (
    <span
      className={`status-pill ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        textTransform: 'uppercase'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.text,
          boxShadow: isOk ? `0 0 6px ${config.text}` : isDelayed ? `0 0 6px ${config.text}` : 'none'
        }}
      />
      <span>{status}</span>
    </span>
  );
}
