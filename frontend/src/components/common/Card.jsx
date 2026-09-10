import React from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  highlight = false,
  style = {},
  onClick
}) {
  return (
    <div
      className={`card ${hoverable ? 'card-hover' : ''} ${highlight ? 'card-highlight' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
