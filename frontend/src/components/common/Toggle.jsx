import React from 'react';

export default function Toggle({
  options = [],
  value,
  onChange,
  className = ''
}) {
  return (
    <div className={`tab-toggle-group ${className}`}>
      {options.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            className={`tab-toggle-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {Icon && <Icon size={15} />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
