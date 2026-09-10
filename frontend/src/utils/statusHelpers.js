/**
 * Status color, icon, and label helper utilities (Light Theme System)
 */

export const STATUS_COLORS = {
  'ON TIME': {
    bg: '#E8F5E9',
    text: '#16803C',
    border: '#A5D6A7',
    badgeClass: 'badge-success'
  },
  'DELAYED': {
    bg: '#FFEBEE',
    text: '#C62828',
    border: '#FFCDD2',
    badgeClass: 'badge-danger'
  },
  'OPTIMIZED': {
    bg: '#E0F2FE',
    text: '#0284C7',
    border: '#BAE6FD',
    badgeClass: 'badge-info'
  },
  'CONFLICT': {
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#FDE68A',
    badgeClass: 'badge-warning'
  },
  'Requested': {
    bg: '#F1F5F9',
    text: '#475569',
    border: '#E2E8F0',
    badgeClass: 'badge-neutral'
  },
  'Under Review': {
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#FDE68A',
    badgeClass: 'badge-warning'
  },
  'Approved': {
    bg: '#E0F2FE',
    text: '#0284C7',
    border: '#BAE6FD',
    badgeClass: 'badge-info'
  },
  'Scheduled': {
    bg: '#EEF2FF',
    text: '#4F46E5',
    border: '#C7D2FE',
    badgeClass: 'badge-primary'
  },
  'Completed': {
    bg: '#E8F5E9',
    text: '#16803C',
    border: '#A5D6A7',
    badgeClass: 'badge-success'
  }
};

export const DEPARTMENT_THEMES = {
  'Engineering': {
    name: 'Engineering (P-Way)',
    tag: 'ENG',
    color: '#003B73', // Railway Blue
    bg: '#E8F1FA',
    border: '#B9D5F1'
  },
  'S&T': {
    name: 'Signal & Telecom',
    tag: 'S&T',
    color: '#16803C', // Railway Green
    bg: '#E8F5E9',
    border: '#A5D6A7'
  },
  'TRD': {
    name: 'Traction Distribution (TRD / OHE)',
    tag: 'TRD',
    color: '#D97706', // Warning Amber
    bg: '#FEF3C7',
    border: '#FDE68A'
  },
  'Freight': {
    name: 'Freight Operations',
    tag: 'FRT',
    color: '#C62828', // Signal Red
    bg: '#FFEBEE',
    border: '#FFCDD2'
  },
  'Joint Multi-Dept Window': {
    name: 'Joint Multi-Dept Window',
    tag: 'JOINT',
    color: '#6D28D9',
    bg: '#F3E8FF',
    border: '#DDD6FE'
  }
};

export function getStatusStyle(status) {
  return STATUS_COLORS[status] || STATUS_COLORS['Requested'];
}
