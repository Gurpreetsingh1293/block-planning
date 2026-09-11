import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, AlertCircle, TrendingUp, Info } from 'lucide-react';

export default function AIExplanationPanel({ optimizationData, engineData }) {
  if (!optimizationData) return null;

  const { summary, recommendations, conflicts } = optimizationData;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Brain size={24} color="#fff" />
        </div>
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            AI Optimization Summary
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Intelligent analysis and decision factors
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
          padding: '20px',
          background: 'var(--bg-surface-alt)',
          borderRadius: '10px'
        }}>
          <SummaryItem label="Total Blocks Created" value={summary.totalBlocks} />
          <SummaryItem label="Critical Tasks" value={summary.criticalTasks} highlight />
          <SummaryItem label="Tasks Grouped" value={summary.tasksGrouped} />
          <SummaryItem label="Passenger Trains Affected" value={summary.passengerTrainsAffected} success={summary.passengerTrainsAffected === 0} />
          <SummaryItem label="Goods Trains Affected" value={summary.goodsTrainsAffected} />
          <SummaryItem label="Estimated Downtime" value={summary.estimatedDowntime} />
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '24px' }}
        >
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp size={18} style={{ color: 'var(--railway-blue)' }} />
            AI Recommendations
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                style={{
                  padding: '12px 16px',
                  background: '#E8F5E9',
                  border: '1px solid #A5D6A7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <CheckCircle size={18} style={{ color: '#2E7D32', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  {rec}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Conflicts */}
      {conflicts && conflicts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} style={{ color: '#D32F2F' }} />
            Identified Conflicts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {conflicts.map((conflict, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{
                  padding: '12px 16px',
                  background: '#FFEBEE',
                  border: '1px solid #FFCDD2',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <AlertCircle size={18} style={{ color: '#C62828', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#C62828', marginBottom: '4px' }}>
                    {conflict.taskId} - {conflict.conflictType}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    {conflict.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Key Decision Factors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--railway-blue-light)',
          border: '1px solid var(--railway-blue-border)',
          borderRadius: '10px'
        }}
      >
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--railway-blue)',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Info size={18} />
          Key Decision Factors
        </h4>
        <ul style={{
          margin: 0,
          paddingLeft: '24px',
          color: 'var(--text-primary)',
          fontSize: '14px',
          lineHeight: '1.8'
        }}>
          <li>Passenger train schedules treated as hard constraints</li>
          <li>Safety-critical and emergency maintenance prioritized</li>
          <li>Compatible tasks grouped to minimize separate blocks</li>
          <li>Low-traffic corridor windows preferred</li>
          <li>Resource availability and equipment requirements considered</li>
          <li>Operational impact and asset downtime minimized</li>
        </ul>
      </motion.div>
    </div>
  );
}

function SummaryItem({ label, value, highlight, success }) {
  return (
    <div>
      <div style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        marginBottom: '4px'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: highlight 
          ? '#D32F2F' 
          : success 
          ? '#2E7D32' 
          : 'var(--text-primary)'
      }}>
        {value}
      </div>
    </div>
  );
}
