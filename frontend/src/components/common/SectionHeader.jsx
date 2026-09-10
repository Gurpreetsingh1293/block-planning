import React from 'react';

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className = ''
}) {
  return (
    <div className={`section-header ${className}`}>
      <div className="section-header-content">
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        {title && <h2 className="section-title">{title}</h2>}
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="section-actions">{actions}</div>}
    </div>
  );
}
