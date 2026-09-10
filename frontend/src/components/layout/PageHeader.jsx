import React from 'react';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  chips = [],
  className = ''
}) {
  return (
    <div className={`page-header-intro ${className}`}>
      <div className="page-header-top">
        <div className="page-header-text-block">
          {eyebrow && <span className="header-eyebrow">{eyebrow}</span>}
          {title && <h1 className="header-title">{title}</h1>}
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>

        {actions && <div className="header-actions">{actions}</div>}
      </div>

      {chips && chips.length > 0 && (
        <div className="header-chips-row">
          {chips.map((chip, idx) => (
            <div key={idx} className="operational-chip">
              <span className="chip-dot" />
              <span>{chip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
