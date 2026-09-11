import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import demoDataService from '../../services/demoDataService';
import DataPreprocessor from '../../utils/dataPreprocessor';

export default function BlockRequestModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    department: '',
    location: '',
    corridor: 'C-01',
    section: 'Delhi-Mathura',
    startStation: '',
    endStation: '',
    issue: '',
    criticality: 'Medium',
    urgency: 'Routine',
    startTime: '',
    endTime: '',
    estimatedDuration: '',
    requiredWorkers: '',
    requiredEquipment: '',
    preferredDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const departments = [
    'Engineering',
    'Signal & Telecommunication',
    'Traction/OHE',
    'Civil',
    'Mechanical'
  ];

  const criticalityLevels = ['Routine', 'Medium', 'High', 'Critical'];
  const urgencyLevels = ['Routine', 'Medium', 'High', 'Critical', 'Emergency'];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Auto-calculate duration if start and end times are set
    if (field === 'startTime' || field === 'endTime') {
      const start = field === 'startTime' ? value : formData.startTime;
      const end = field === 'endTime' ? value : formData.endTime;
      
      if (start && end) {
        try {
          const duration = DataPreprocessor.getTimeDifferenceMinutes(start, end) / 60;
          if (duration > 0) {
            setFormData(prev => ({ ...prev, estimatedDuration: duration.toFixed(1) }));
          }
        } catch (error) {
          // Invalid time format
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.issue || formData.issue.length < 10) {
      newErrors.issue = 'Please provide a detailed description (minimum 10 characters)';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const validation = DataPreprocessor.validateBlockRequest({
        startTime: formData.startTime,
        endTime: formData.endTime,
        department: formData.department,
        location: formData.location,
        requiredWorkers: formData.requiredWorkers ? parseInt(formData.requiredWorkers) : 0
      });

      if (!validation.valid) {
        validation.errors.forEach(error => {
          if (error.includes('End time')) {
            newErrors.endTime = error;
          } else if (error.includes('duration')) {
            newErrors.duration = error;
          } else if (error.includes('worker')) {
            newErrors.requiredWorkers = error;
          }
        });
      }
    }

    if (!formData.requiredWorkers || parseInt(formData.requiredWorkers) < 1) {
      newErrors.requiredWorkers = 'At least 1 worker is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Parse equipment string into array
      const equipment = formData.requiredEquipment
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Create block request
      const blockRequest = {
        department: formData.department,
        location: formData.location,
        corridor: formData.corridor,
        section: formData.section,
        startStation: formData.startStation || 'Delhi',
        endStation: formData.endStation || 'Mathura',
        issue: formData.issue,
        criticality: formData.criticality,
        urgency: formData.urgency,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: parseFloat(formData.estimatedDuration),
        date: formData.preferredDate,
        requiredWorkers: parseInt(formData.requiredWorkers),
        requiredEquipment: equipment.length > 0 ? equipment : ['Standard Tools'],
        affectedPassengerTrains: 0, // Will be calculated by AI
        affectedGoodsTrains: 0,
        riskLevel: formData.criticality === 'Critical' || formData.urgency === 'Emergency' ? 'High' : 'Medium'
      };

      // Save to demo data service (localStorage persistence)
      const savedBlock = demoDataService.addBlockRequest(blockRequest);

      // Also add as maintenance task for AI Engine
      const maintenanceTask = {
        department: formData.department,
        assetId: 'PENDING',
        assetType: 'General',
        location: formData.location,
        corridor: formData.corridor,
        section: formData.section,
        defect: formData.issue,
        criticality: formData.criticality,
        urgency: formData.urgency,
        dueDate: formData.preferredDate,
        estimatedDuration: parseFloat(formData.estimatedDuration),
        requiredWorkers: parseInt(formData.requiredWorkers),
        requiredEquipment: equipment.length > 0 ? equipment : ['Standard Tools'],
        blockRequired: true,
        status: 'Pending',
        riskLevel: blockRequest.riskLevel,
        safetyImpact: formData.urgency === 'Emergency' || formData.criticality === 'Critical' ? 'High' : 'Medium',
        operationalImpact: formData.urgency === 'Emergency' || formData.criticality === 'Critical' ? 'High' : 'Medium',
        preferredTimeWindow: `${formData.startTime}-${formData.endTime}`
      };

      demoDataService.addMaintenanceTask(maintenanceTask);

      // Show success message
      if (onSuccess) {
        onSuccess(savedBlock);
      }

      // Close modal
      setTimeout(() => {
        onClose();
        // Reset form
        setFormData({
          department: '',
          location: '',
          corridor: 'C-01',
          section: 'Delhi-Mathura',
          startStation: '',
          endStation: '',
          issue: '',
          criticality: 'Medium',
          urgency: 'Routine',
          startTime: '',
          endTime: '',
          estimatedDuration: '',
          requiredWorkers: '',
          requiredEquipment: '',
          preferredDate: new Date().toISOString().split('T')[0]
        });
      }, 1500);

    } catch (error) {
      console.error('Error submitting block request:', error);
      alert('Failed to submit block request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '32px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Request Maintenance Block
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Department */}
              <FormField label="Department" required error={errors.department}>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </FormField>

              {/* Location */}
              <FormField label="Location" required error={errors.location}>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., Delhi-Mathura Section, KM 42-45"
                  style={inputStyle}
                />
              </FormField>

              {/* Issue/Problem Description */}
              <FormField label="Issue / Problem Description" required error={errors.issue}>
                <textarea
                  value={formData.issue}
                  onChange={(e) => handleChange('issue', e.target.value)}
                  placeholder="Describe the maintenance issue in detail..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </FormField>

              {/* Criticality and Urgency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Criticality" required>
                  <select
                    value={formData.criticality}
                    onChange={(e) => handleChange('criticality', e.target.value)}
                    style={inputStyle}
                  >
                    {criticalityLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Urgency" required>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleChange('urgency', e.target.value)}
                    style={inputStyle}
                  >
                    {urgencyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Time Window */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <FormField label="Start Time" required error={errors.startTime}>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    style={inputStyle}
                  />
                </FormField>

                <FormField label="End Time" required error={errors.endTime}>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    style={inputStyle}
                  />
                </FormField>

                <FormField label="Duration (hours)" error={errors.duration}>
                  <input
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleChange('estimatedDuration', e.target.value)}
                    placeholder="Auto"
                    step="0.5"
                    min="0.5"
                    max="8"
                    style={inputStyle}
                    readOnly
                  />
                </FormField>
              </div>

              {/* Workers and Equipment */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <FormField label="Required Workers" required error={errors.requiredWorkers}>
                  <input
                    type="number"
                    value={formData.requiredWorkers}
                    onChange={(e) => handleChange('requiredWorkers', e.target.value)}
                    placeholder="e.g., 5"
                    min="1"
                    style={inputStyle}
                  />
                </FormField>

                <FormField label="Required Equipment (comma-separated)">
                  <input
                    type="text"
                    value={formData.requiredEquipment}
                    onChange={(e) => handleChange('requiredEquipment', e.target.value)}
                    placeholder="e.g., Tamping Machine, Rail Grinder"
                    style={inputStyle}
                  />
                </FormField>
              </div>

              {/* Date */}
              <FormField label="Preferred Date" required>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleChange('preferredDate', e.target.value)}
                  style={inputStyle}
                />
              </FormField>

              {/* Error Summary */}
              {Object.keys(errors).length > 0 && (
                <div style={{
                  padding: '12px 16px',
                  background: '#FFF3E0',
                  border: '1px solid #FFB74D',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <AlertCircle size={18} style={{ color: '#F57C00', marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    Please fix the errors above before submitting.
                  </div>
                </div>
              )}

              {/* Success Message */}
              {submitting && (
                <div style={{
                  padding: '12px 16px',
                  background: '#E8F5E9',
                  border: '1px solid #A5D6A7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle size={18} style={{ color: '#2E7D32' }} />
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>
                    Block request submitted successfully!
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'var(--bg-surface-alt)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.5 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 2,
                    padding: '12px 24px',
                    background: submitting ? '#9CA3AF' : 'var(--railway-blue)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Block Request'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '8px'
      }}>
        {label}
        {required && <span style={{ color: '#DC2626', marginLeft: '4px' }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{
          marginTop: '6px',
          fontSize: '13px',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  border: '1px solid var(--border-medium)',
  borderRadius: '8px',
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit'
};
