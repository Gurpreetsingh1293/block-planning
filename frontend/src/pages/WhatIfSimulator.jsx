import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  ArrowRight,
  Clock,
  Train,
  AlertTriangle,
  TrendingUp,
  Users,
  Wrench,
  Calendar,
  ChevronDown,
  PlayCircle,
  RotateCcw,
  Package
} from 'lucide-react';
import demoDataService from '../services/demoDataService';
import aiService from '../services/aiService';
import DataPreprocessor from '../utils/dataPreprocessor';

export default function WhatIfSimulator() {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [scenarioType, setScenarioType] = useState('');
  const [scenarioParams, setScenarioParams] = useState({});
  const [currentPlan, setCurrentPlan] = useState(null);
  const [simulatedPlan, setSimulatedPlan] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [engineData, setEngineData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const blockData = demoDataService.getBlockRequests();
    setBlocks(blockData);
    
    const data = demoDataService.getAIEngineData();
    setEngineData(data);
    
    if (blockData.length > 0) {
      setSelectedBlock(blockData[0]);
      setCurrentPlan(blockData[0]);
    }
  };

  const scenarioTypes = [
    {
      id: 'shift-time',
      name: 'Shift Block Time',
      description: 'Change the start/end time of the block',
      icon: Clock
    },
    {
      id: 'extend-duration',
      name: 'Extend Duration',
      description: 'Increase the block duration',
      icon: TrendingUp
    },
    {
      id: 'traffic-increase',
      name: 'Traffic Increase',
      description: 'Simulate increased train traffic',
      icon: Train
    },
    {
      id: 'emergency-task',
      name: 'Emergency Task',
      description: 'Add urgent maintenance requirement',
      icon: AlertTriangle
    },
    {
      id: 'staff-shortage',
      name: 'Staff Shortage',
      description: 'Reduce available workers',
      icon: Users
    },
    {
      id: 'equipment-unavailable',
      name: 'Equipment Unavailable',
      description: 'Simulate equipment failure',
      icon: Wrench
    }
  ];

  const handleScenarioSelect = (type) => {
    setScenarioType(type);
    setSimulatedPlan(null);
    
    // Initialize default params based on scenario type
    if (type === 'shift-time' && selectedBlock) {
      setScenarioParams({
        newStartTime: selectedBlock.startTime,
        newEndTime: selectedBlock.endTime
      });
    } else if (type === 'extend-duration' && selectedBlock) {
      setScenarioParams({
        additionalHours: 1
      });
    } else if (type === 'traffic-increase') {
      setScenarioParams({
        increasePercentage: 20
      });
    } else if (type === 'staff-shortage' && selectedBlock) {
      setScenarioParams({
        availableWorkers: Math.max(1, selectedBlock.requiredWorkers - 2)
      });
    } else if (type === 'emergency-task') {
      setScenarioParams({
        taskDuration: 2,
        taskCriticality: 'Emergency'
      });
    } else if (type === 'equipment-unavailable' && selectedBlock) {
      setScenarioParams({
        unavailableEquipment: selectedBlock.requiredEquipment?.[0] || 'Tamping Machine'
      });
    }
  };

  const runSimulation = async () => {
    if (!selectedBlock || !scenarioType || !engineData) {
      alert('Please select a block and scenario type');
      return;
    }

    setAnalyzing(true);

    try {
      // Build proposed change based on scenario type
      let proposedChange = { ...selectedBlock };
      let scenarioDescription = '';

      if (scenarioType === 'shift-time') {
        proposedChange.startTime = scenarioParams.newStartTime;
        proposedChange.endTime = scenarioParams.newEndTime;
        scenarioDescription = `Shift block from ${selectedBlock.startTime}-${selectedBlock.endTime} to ${scenarioParams.newStartTime}-${scenarioParams.newEndTime}`;
      } else if (scenarioType === 'extend-duration') {
        const currentDuration = DataPreprocessor.getTimeDifferenceMinutes(
          selectedBlock.startTime,
          selectedBlock.endTime
        );
        const newDuration = currentDuration + (scenarioParams.additionalHours * 60);
        const startMinutes = DataPreprocessor.timeToMinutes(selectedBlock.startTime);
        const newEndTime = DataPreprocessor.minutesToTime(startMinutes + newDuration);
        proposedChange.endTime = newEndTime;
        proposedChange.duration = newDuration / 60;
        scenarioDescription = `Extend block duration by ${scenarioParams.additionalHours} hours`;
      } else if (scenarioType === 'traffic-increase') {
        scenarioDescription = `Increase traffic by ${scenarioParams.increasePercentage}%`;
      } else if (scenarioType === 'staff-shortage') {
        proposedChange.requiredWorkers = selectedBlock.requiredWorkers;
        proposedChange.availableWorkers = scenarioParams.availableWorkers;
        scenarioDescription = `Staff shortage: ${scenarioParams.availableWorkers} of ${selectedBlock.requiredWorkers} workers available`;
      } else if (scenarioType === 'emergency-task') {
        scenarioDescription = `New ${scenarioParams.taskCriticality} task requiring ${scenarioParams.taskDuration} hours`;
      } else if (scenarioType === 'equipment-unavailable') {
        scenarioDescription = `Equipment unavailable: ${scenarioParams.unavailableEquipment}`;
        proposedChange.unavailableEquipment = scenarioParams.unavailableEquipment;
      }

      // Call AI What-If API
      const result = await aiService.analyzeWhatIf({
        scenarioType,
        scenarioDescription,
        currentPlan: selectedBlock,
        proposedChange,
        passengerTrains: engineData.passengerTrains,
        goodsTrains: engineData.goodsTrains,
        maintenanceTasks: engineData.maintenanceTasks
      });

      setSimulatedPlan(result.data);
    } catch (error) {
      console.error('What-If analysis error:', error);
      alert(`Analysis failed: ${error.message}\n\nPlease ensure:\n1. Backend server is running\n2. GROQ_API_KEY is configured`);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetSimulation = () => {
    setSimulatedPlan(null);
    setScenarioType('');
    setScenarioParams({});
  };

  return (
    <div style={{
      padding: '32px',
      background: 'var(--bg-app)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Lightbulb size={32} color="#fff" />
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              What-If Simulator
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Analyze potential changes before committing to a block plan
            </p>
          </div>
        </div>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* LEFT: Scenario Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            1. Select Block
          </h2>
          <select
            value={selectedBlock?.blockId || ''}
            onChange={(e) => {
              const block = blocks.find(b => b.blockId === e.target.value);
              setSelectedBlock(block);
              setCurrentPlan(block);
              setSimulatedPlan(null);
            }}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '24px'
            }}
          >
            {blocks.map(block => (
              <option key={block.blockId} value={block.blockId}>
                {block.blockId} - {block.department}
              </option>
            ))}
          </select>

          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            2. Select Scenario
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {scenarioTypes.map(scenario => {
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario.id)}
                  style={{
                    padding: '12px 16px',
                    background: scenarioType === scenario.id ? 'var(--railway-blue-light)' : 'var(--bg-surface-alt)',
                    border: scenarioType === scenario.id ? '2px solid var(--railway-blue)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <Icon size={18} style={{ color: 'var(--railway-blue)' }} />
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                      {scenario.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '28px' }}>
                    {scenario.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scenario Parameters */}
          {scenarioType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginBottom: '24px' }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
                3. Configure Parameters
              </h2>
              <ScenarioParameters 
                scenarioType={scenarioType}
                params={scenarioParams}
                onChange={setScenarioParams}
                selectedBlock={selectedBlock}
              />
            </motion.div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={runSimulation}
              disabled={!scenarioType || analyzing}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: analyzing ? '#9CA3AF' : 'var(--railway-blue)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: analyzing || !scenarioType ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <PlayCircle size={18} />
              {analyzing ? 'Analyzing...' : 'Run Simulation'}
            </button>
            <button
              onClick={resetSimulation}
              style={{
                padding: '12px 16px',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </motion.div>

        {/* CENTER: Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Current Plan
          </h2>
          {currentPlan ? (
            <BlockPlanCard block={currentPlan} />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No block selected
            </div>
          )}
        </motion.div>

        {/* RIGHT: Simulated Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Simulated Plan
          </h2>
          {analyzing ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '16px' }}>
                <PlayCircle size={48} style={{ color: 'var(--railway-blue)' }} />
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Analyzing scenario...</div>
            </div>
          ) : simulatedPlan ? (
            <BlockPlanCard block={simulatedPlan.proposedChange || currentPlan} isSimulated />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Run simulation to see results
            </div>
          )}
        </motion.div>
      </div>

      {/* Impact Analysis */}
      {simulatedPlan && (
        <ImpactAnalysis 
          impact={simulatedPlan.impact}
          recommendation={simulatedPlan.recommendation}
          riskAssessment={simulatedPlan.riskAssessment}
          comparison={simulatedPlan.comparison}
        />
      )}
    </div>
  );
}

function ScenarioParameters({ scenarioType, params, onChange, selectedBlock }) {
  if (scenarioType === 'shift-time') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            New Start Time
          </label>
          <input
            type="time"
            value={params.newStartTime || ''}
            onChange={(e) => onChange({ ...params, newStartTime: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            New End Time
          </label>
          <input
            type="time"
            value={params.newEndTime || ''}
            onChange={(e) => onChange({ ...params, newEndTime: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>
    );
  }

  if (scenarioType === 'extend-duration') {
    return (
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Additional Hours
        </label>
        <input
          type="number"
          value={params.additionalHours || 1}
          onChange={(e) => onChange({ ...params, additionalHours: parseFloat(e.target.value) })}
          min="0.5"
          max="4"
          step="0.5"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--border-medium)',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
    );
  }

  if (scenarioType === 'traffic-increase') {
    return (
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Traffic Increase (%)
        </label>
        <input
          type="number"
          value={params.increasePercentage || 20}
          onChange={(e) => onChange({ ...params, increasePercentage: parseInt(e.target.value) })}
          min="10"
          max="100"
          step="10"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--border-medium)',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
    );
  }

  if (scenarioType === 'staff-shortage') {
    return (
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Available Workers (Required: {selectedBlock?.requiredWorkers || 'N/A'})
        </label>
        <input
          type="number"
          value={params.availableWorkers || 1}
          onChange={(e) => onChange({ ...params, availableWorkers: parseInt(e.target.value) })}
          min="1"
          max={selectedBlock?.requiredWorkers || 10}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--border-medium)',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
    );
  }

  if (scenarioType === 'emergency-task') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            Task Duration (hours)
          </label>
          <input
            type="number"
            value={params.taskDuration || 2}
            onChange={(e) => onChange({ ...params, taskDuration: parseFloat(e.target.value) })}
            min="0.5"
            max="8"
            step="0.5"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            Criticality
          </label>
          <select
            value={params.taskCriticality || 'Emergency'}
            onChange={(e) => onChange({ ...params, taskCriticality: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="Emergency">Emergency</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
    );
  }

  if (scenarioType === 'equipment-unavailable') {
    return (
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Unavailable Equipment
        </label>
        <select
          value={params.unavailableEquipment || ''}
          onChange={(e) => onChange({ ...params, unavailableEquipment: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--border-medium)',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          {selectedBlock?.requiredEquipment?.map(eq => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
      </div>
    );
  }

  return null;
}

function BlockPlanCard({ block, isSimulated }) {
  return (
    <div style={{
      padding: '16px',
      background: isSimulated ? '#F3E8FF' : 'var(--bg-surface-alt)',
      border: `2px solid ${isSimulated ? '#A78BFA' : 'var(--border-subtle)'}`,
      borderRadius: '10px'
    }}>
      <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
        {block.blockId}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
        <InfoRow icon={Clock} label="Time" value={`${block.startTime} - ${block.endTime}`} />
        <InfoRow icon={Calendar} label="Duration" value={`${block.duration || 0}h`} />
        <InfoRow icon={Users} label="Workers" value={block.requiredWorkers || 'N/A'} />
        <InfoRow icon={Train} label="Passenger Trains" value={block.affectedPassengerTrains || 0} />
        <InfoRow icon={Package} label="Goods Trains" value={block.affectedGoodsTrains || 0} />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
        <Icon size={14} />
        <span>{label}:</span>
      </div>
      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function ImpactAnalysis({ impact, recommendation, riskAssessment, comparison }) {
  if (!impact) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>
        Impact Analysis
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Impact Details */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Operational Impact
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {impact.passengerTrains && (
              <ImpactCard
                label="Passenger Trains"
                value={impact.passengerTrains.affected}
                color={impact.passengerTrains.affected > 0 ? '#DC2626' : '#16803C'}
              />
            )}
            {impact.goodsTrains && (
              <ImpactCard
                label="Goods Trains"
                value={impact.goodsTrains.affected}
                color={impact.goodsTrains.affected > 0 ? '#F59E0B' : '#16803C'}
              />
            )}
            {impact.maintenance && (
              <ImpactCard
                label="Tasks Delayed"
                value={impact.maintenance.tasksDelayed}
                color={impact.maintenance.tasksDelayed > 0 ? '#DC2626' : '#16803C'}
              />
            )}
          </div>
        </div>

        {/* Risk Assessment */}
        {riskAssessment && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Risk Assessment
            </h3>
            <div style={{
              padding: '16px',
              background: getRiskColor(riskAssessment.level).bg,
              border: `2px solid ${getRiskColor(riskAssessment.level).border}`,
              borderRadius: '10px'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: getRiskColor(riskAssessment.level).text,
                marginBottom: '8px'
              }}>
                {riskAssessment.level}
              </div>
              {riskAssessment.factors && riskAssessment.factors.length > 0 && (
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  {riskAssessment.factors.slice(0, 3).map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendation */}
      {recommendation && (
        <div style={{ marginTop: '24px', padding: '20px', background: 'var(--railway-blue-light)', borderRadius: '10px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--railway-blue)' }}>
            AI Recommendation
          </h3>
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            color: recommendation.action === 'APPROVE' ? '#16803C' : recommendation.action === 'REJECT' ? '#DC2626' : '#F59E0B',
            marginBottom: '8px'
          }}>
            {recommendation.action}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {recommendation.reasoning}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ImpactCard({ label, value, color }) {
  return (
    <div style={{
      padding: '12px 16px',
      background: 'var(--bg-surface-alt)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '20px', fontWeight: '700', color }}>{value}</span>
    </div>
  );
}

function getRiskColor(level) {
  const colors = {
    LOW: { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32' },
    MEDIUM: { bg: '#FFF8E1', border: '#FFE082', text: '#F57F17' },
    HIGH: { bg: '#FFF3E0', border: '#FFCC80', text: '#E65100' },
    CRITICAL: { bg: '#FFEBEE', border: '#FFCDD2', text: '#C62828' }
  };
  return colors[level] || colors.MEDIUM;
}
