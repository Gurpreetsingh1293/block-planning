import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Users, 
  Wrench, 
  Train, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2
} from 'lucide-react';
import { generateBlockReport } from '../../utils/reportGenerator';

export default function OptimizedBlockCard({ block, maintenanceTasks, passengerTrains, goodsTrains }) {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    EMERGENCY: { bg: '#FFEBEE', border: '#EF5350', text: '#B71C1C' },
    CRITICAL: { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
    HIGH: { bg: '#FFF8E1', border: '#FFC107', text: '#F57F17' },
    MEDIUM: { bg: '#E8F5E9', border: '#66BB6A', text: '#2E7D32' },
    ROUTINE: { bg: '#E3F2FD', border: '#42A5F5', text: '#1565C0' }
  };

  const colors = priorityColors[block.priority] || priorityColors.MEDIUM;

  const relatedTasks = maintenanceTasks.filter(task => 
    block.taskIds && block.taskIds.includes(task.taskId)
  );

  const handleDownloadReport = () => {
    generateBlockReport({
      block,
      relatedTasks,
      passengerTrains,
      goodsTrains
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        background: 'var(--bg-card)',
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
        cursor: 'pointer'
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {block.blockId}
            </h3>
            <span style={{
              padding: '4px 12px',
              background: colors.bg,
              color: colors.text,
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '700',
              border: `1px solid ${colors.border}`
            }}>
              {block.priority}
            </span>
          </div>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {block.departments?.join(', ')} • {block.location}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {/* Quick Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <InfoItem icon={Clock} label="Time Window" value={`${block.startTime} - ${block.endTime}`} />
        <InfoItem icon={Clock} label="Duration" value={`${block.estimatedDuration}h`} />
        <InfoItem icon={Users} label="Workers" value={block.requiredWorkers} />
        <InfoItem icon={Train} label="Passenger Trains" value={block.affectedPassengerTrains || 0} highlight={block.affectedPassengerTrains === 0} />
        <InfoItem icon={Train} label="Goods Trains" value={block.affectedGoodsTrains || 0} />
      </div>

      {/* AI Reasoning */}
      <div style={{
        padding: '16px',
        background: 'var(--railway-blue-light)',
        border: '1px solid var(--railway-blue-border)',
        borderRadius: '8px',
        marginBottom: expanded ? '16px' : 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertCircle size={18} style={{ color: 'var(--railway-blue)', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--railway-blue)', marginBottom: '4px' }}>
              AI Recommendation
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {block.reasoning}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}
        >
          {/* Related Tasks */}
          {relatedTasks.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
                Maintenance Tasks
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relatedTasks.map(task => (
                  <div
                    key={task.taskId}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-surface-alt)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{task.taskId}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{task.department}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {task.defect}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Equipment */}
          {block.requiredEquipment && block.requiredEquipment.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
                <Wrench size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Required Equipment
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {block.requiredEquipment.map((equipment, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '6px 12px',
                      background: 'var(--bg-surface-alt)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {equipment}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadReport();
            }}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'var(--railway-blue)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--railway-blue-hover)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--railway-blue)'}
          >
            <Download size={18} />
            Download Block Report (PDF)
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value, highlight }) {
  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '4px',
        color: 'var(--text-secondary)',
        fontSize: '13px'
      }}>
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <div style={{
        fontSize: '18px',
        fontWeight: '700',
        color: highlight ? '#16803C' : 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {value}
        {highlight && <CheckCircle2 size={18} style={{ color: '#16803C' }} />}
      </div>
    </div>
  );
}
