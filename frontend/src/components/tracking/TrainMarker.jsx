import React from 'react';
import { Train, Package, AlertTriangle } from 'lucide-react';

export default function TrainMarker({
  train,
  isSelected,
  onClick
}) {
  const isCargo = train.type === 'CARGO';
  const isDelayed = train.delay > 0;

  return (
    <div
      className={`train-marker-pin ${isSelected ? 'marker-selected' : ''} ${isCargo ? 'marker-cargo' : 'marker-passenger'} ${isDelayed ? 'marker-delayed' : ''}`}
      style={{
        left: `${train.coordinates.x}%`,
        top: `${train.coordinates.y}%`
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(train);
      }}
      title={`${train.number} - ${train.name} (${train.status})`}
    >
      <div className="marker-radar-wave" />
      <div className="marker-core-badge">
        {isCargo ? <Package size={12} /> : <Train size={12} />}
        <span className="marker-number-text">{train.number.replace('FREIGHT ', '')}</span>
      </div>

      <div className="marker-floating-tooltip">
        <span className="tooltip-name">{train.name}</span>
        <span className="tooltip-status">{train.status}</span>
      </div>
    </div>
  );
}
