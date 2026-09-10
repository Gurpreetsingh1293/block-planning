import React from 'react';
import { STATUS_COLORS } from '../../utils/statusHelpers';

export default function TaskStatusFilter({
  selectedStatus,
  onSelectStatus,
  statusCounts = {}
}) {
  const statuses = [
    'All Statuses',
    'Requested',
    'Under Review',
    'Approved',
    'Scheduled',
    'Completed'
  ];

  return (
    <div className="filter-group-block">
      <div className="filter-group-title">
        <span className="filter-title-label">TASK STATUS</span>
      </div>

      <div className="status-filter-list">
        {statuses.map((status) => {
          const isSelected = selectedStatus === status;
          const config = STATUS_COLORS[status] || { text: '#94a3b8' };

          return (
            <button
              key={status}
              type="button"
              className={`status-filter-btn ${isSelected ? 'status-filter-active' : ''}`}
              onClick={() => onSelectStatus(status)}
            >
              <div className="status-btn-left">
                <span
                  className="status-color-square"
                  style={{ backgroundColor: config.text }}
                />
                <span className="status-name-label">{status}</span>
              </div>

              {statusCounts[status] !== undefined && (
                <span className="status-count-pill">{statusCounts[status]}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
