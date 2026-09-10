import React from 'react';
import { Users, Package } from 'lucide-react';

export default function PassengerCargoToggle({ value, onChange }) {
  return (
    <div className="passenger-cargo-toggle-control">
      <button
        type="button"
        className={`mode-toggle-btn ${value === 'PASSENGER' ? 'mode-active' : ''}`}
        onClick={() => onChange('PASSENGER')}
      >
        <Users size={16} />
        <span>PASSENGER</span>
      </button>

      <button
        type="button"
        className={`mode-toggle-btn ${value === 'CARGO' ? 'mode-active' : ''}`}
        onClick={() => onChange('CARGO')}
      >
        <Package size={16} />
        <span>CARGO</span>
      </button>
    </div>
  );
}
