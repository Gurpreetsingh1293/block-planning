import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral'
  pulse = false,
  icon: Icon,
  className = ''
}) {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    primary: 'badge-primary',
    neutral: 'badge-neutral',
    default: 'badge-default'
  };

  return (
    <span className={`badge ${variantClasses[variant] || 'badge-default'} ${className}`}>
      {pulse && <span className="badge-pulse" />}
      {Icon && <Icon size={12} />}
      <span>{children}</span>
    </span>
  );
}
