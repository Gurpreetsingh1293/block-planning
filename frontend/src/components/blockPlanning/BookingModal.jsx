import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplayTime } from '../../utils/timeHelpers';

const DEPARTMENTS = [
  { value: 'Civil', label: 'Civil', color: '#DCBF7B' },
  { value: 'Electrical', label: 'Electrical', color: '#D9968A' },
  { value: 'Signal', label: 'Signal', color: '#7AAFA7' },
  { value: 'Signal & Telecom', label: 'Signal & Telecom', color: '#AF9DC9' },
  { value: 'Mechanical', label: 'Mechanical', color: '#9eafc2' },
  { value: 'Operations', label: 'Operations', color: '#7AAFA7' },
];

const DEPT_COLOR_MAP = {
  Civil: '#DCBF7B',
  Electrical: '#D9968A',
  Signal: '#7AAFA7',
  'Signal & Telecom': '#AF9DC9',
  Mechanical: '#9eafc2',
  Operations: '#7AAFA7',
};

/**
 * Junior Engineer Booking Modal
 * Triggered when clicking an Available block card
 */
export default function BookingModal({ block, onClose, onBook }) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!block) return null;

  const startDisplay = formatDisplayTime(block.startTime);
  const endDisplay = formatDisplayTime(block.endTime);
  const durationLabel = block.duration ? String(block.duration) : `${block.durationMinutes} min`;

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Junior Engineer name is required';
    if (!department) e.department = 'Please select your department';
    if (!description.trim()) e.description = 'Work description is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onBook({
        blockId: block.slotId || block._id || block.id,
        name: name.trim(),
        department,
        description: description.trim(),
        date: block.date,
        startTime: block.startTime,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deptColor = DEPT_COLOR_MAP[department] || '#3B82F6';

  return (
    <AnimatePresence>
      <motion.div
        key="booking-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,26,51,0.55)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: 14,
            width: '100%',
            maxWidth: 500,
            boxShadow: '0 20px 60px rgba(0,26,51,0.28)',
            overflow: 'hidden',
          }}
        >
          {/* Modal Header */}
          <div style={{
            background: '#001A33',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: '#93c5fd', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Claim Maintenance Slot
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginTop: 2 }}>
                {block.title}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                cursor: 'pointer',
                width: 32,
                height: 32,
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Slot Info Bar */}
          <div style={{
            background: '#EFF6FF',
            borderBottom: '1px solid #BFDBFE',
            padding: '10px 20px',
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
          }}>
            <InfoChip icon="📅" value={block.date || '—'} />
            <InfoChip icon="🕐" value={`${startDisplay} – ${endDisplay}`} />
            <InfoChip icon="⏱️" value={durationLabel} />
            {block.section && <InfoChip icon="📍" value={block.section} />}
            {block.track && <InfoChip icon="🛤️" value={block.track} />}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '20px 20px 24px' }}>
            {/* JE Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                Junior Engineer Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((e2) => ({ ...e2, name: '' })); }}
                placeholder="e.g. Ramesh Kumar"
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? '#ef4444' : '#d1d5db',
                }}
              />
              {errors.name && <div style={errorStyle}>{errors.name}</div>}
            </div>

            {/* Department */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                Department <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={department}
                  onChange={(e) => { setDepartment(e.target.value); setErrors((err) => ({ ...err, department: '' })); }}
                  style={{
                    ...inputStyle,
                    borderColor: errors.department ? '#ef4444' : '#d1d5db',
                    paddingLeft: department ? 34 : 12,
                  }}
                >
                  <option value="">Select your department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                {department && (
                  <div style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: deptColor,
                    pointerEvents: 'none',
                  }} />
                )}
              </div>
              {errors.department && <div style={errorStyle}>{errors.department}</div>}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                Description of Task <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrors((err) => ({ ...err, description: '' })); }}
                placeholder="Describe the maintenance work to be carried out..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: 80,
                  borderColor: errors.description ? '#ef4444' : '#d1d5db',
                }}
              />
              {errors.description && <div style={errorStyle}>{errors.description}</div>}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                style={{
                  padding: '9px 20px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '9px 22px',
                  borderRadius: 8,
                  border: 'none',
                  background: submitting ? '#94a3b8' : '#001A33',
                  color: '#fff',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                {submitting ? (
                  <>
                    <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.6s linear infinite' }} />
                    Booking...
                  </>
                ) : (
                  '✓ Confirm Booking'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AnimatePresence>
  );
}

function InfoChip({ icon, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#1e40af' }}>
      <span>{icon}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 5,
  letterSpacing: '0.02em',
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1.5px solid #d1d5db',
  fontSize: 13,
  color: '#111827',
  background: '#f9fafb',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
};

const errorStyle = {
  marginTop: 4,
  fontSize: 11,
  color: '#ef4444',
  fontWeight: 500,
};
