import React from 'react';
import { Layers, Wrench, Radio, Zap, SplitSquareVertical } from 'lucide-react';

export default function DepartmentPanel({
  selectedDept,
  onSelectDept,
  deptCounts = {}
}) {
  const departments = [
    { name: 'All Departments', icon: Layers, color: '#38bdf8' },
    { name: 'Engineering', icon: Wrench, color: '#0284c7' },
    { name: 'S&T', icon: Radio, color: '#059669' },
    { name: 'TRD', icon: Zap, color: '#d97706' },
    { name: 'Joint Multi-Dept Window', icon: SplitSquareVertical, color: '#7c3aed' }
  ];

  return (
    <div className="filter-group-block">
      <div className="filter-group-title">
        <span className="filter-title-label">DEPARTMENTS</span>
      </div>

      <div className="department-filter-list">
        {departments.map((dept) => {
          const isSelected = selectedDept === dept.name;
          const Icon = dept.icon;
          return (
            <button
              key={dept.name}
              type="button"
              className={`dept-filter-btn ${isSelected ? 'dept-filter-active' : ''}`}
              onClick={() => onSelectDept(dept.name)}
            >
              <div className="dept-btn-left">
                <span
                  className="dept-color-dot"
                  style={{ backgroundColor: dept.color }}
                />
                <Icon size={14} className="dept-icon" />
                <span className="dept-name-label">{dept.name}</span>
              </div>

              {deptCounts[dept.name] !== undefined && (
                <span className="dept-count-pill">{deptCounts[dept.name]}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
