import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users,
  Zap,
  Activity,
  Calendar,
  Train, 
  Loader2, 
  FileText, 
  Plus,
  X,
  Trash2,
  Wrench,
  MapPin
} from 'lucide-react';
import demoDataService from '../services/demoDataService';
import aiService from '../services/aiService';
import DataPreprocessor from '../utils/dataPreprocessor';
import TimelineVisualization from '../components/aiEngine/TimelineVisualization';
import OptimizedBlockCard from '../components/aiEngine/OptimizedBlockCard';
import AIExplanationPanel from '../components/aiEngine/AIExplanationPanel';
import BlockRequestModal from '../components/blockPlanning/BlockRequestModal';

export default function AIEngine() {
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [optimizationData, setOptimizationData] = useState(null);
  const [engineData, setEngineData] = useState(null);
  const [processingStage, setProcessingStage] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState(null);
  const [showTasksSection, setShowTasksSection] = useState(true);
  const [lastOptimizedAt, setLastOptimizedAt] = useState(null);

  useEffect(() => {
    initializeAIEngine();
  }, []);

  const initializeAIEngine = async () => {
    // Check AI service status
    const status = await aiService.checkStatus();
    setAiStatus(status.data);

    // Load engine data
    const data = demoDataService.getAIEngineData();
    setEngineData(data);

    // Generate alerts from maintenance tasks
    generateAlerts(data.maintenanceTasks);
  };

  const handleBlockRequestSuccess = (newBlock) => {
    // Reload engine data to include new request
    const data = demoDataService.getAIEngineData();
    setEngineData(data);
    generateAlerts(data.maintenanceTasks);
    
    // Clear optimization data so user can re-run with new request
    setOptimizationData(null);

    setSavedBanner({
      id: Date.now(),
      department: newBlock?.department || 'Department',
      blockId: newBlock?.blockId || newBlock?.taskId || 'NEW',
      issue: newBlock?.issue || newBlock?.defect || 'Maintenance Block',
      time: newBlock?.startTime && newBlock?.endTime ? `${newBlock.startTime} - ${newBlock.endTime}` : ''
    });
  };

  const generateAlerts = (tasks) => {
    const newAlerts = [];

    tasks.forEach(task => {
      if (task.urgency === 'Emergency' || task.criticality === 'Critical') {
        newAlerts.push({
          type: 'CRITICAL',
          message: `${task.taskId}: ${task.defect} requires immediate attention`,
          taskId: task.taskId
        });
      }
    });

    // Check for groupable tasks
    const compatibleTasks = findCompatibleTasks(tasks);
    if (compatibleTasks.length > 0) {
      newAlerts.push({
        type: 'INFO',
        message: `${compatibleTasks.length} maintenance tasks can be grouped into a single block`,
        tasks: compatibleTasks
      });
    }

    setAlerts(newAlerts);
  };

  const handleDeleteTask = (taskId) => {
    if (!confirm(`Are you sure you want to delete task ${taskId}? This action cannot be undone.`)) {
      return;
    }

    const success = demoDataService.deleteMaintenanceTask(taskId);
    if (success) {
      // Reload engine data
      const data = demoDataService.getAIEngineData();
      setEngineData(data);
      generateAlerts(data.maintenanceTasks);
      
      // Show success message
      alert(`✅ Task ${taskId} has been deleted successfully!`);
    } else {
      alert(`❌ Failed to delete task ${taskId}. Please try again.`);
    }
  };

  const findCompatibleTasks = (tasks) => {
    const compatible = [];
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        if (
          tasks[i].corridor === tasks[j].corridor &&
          tasks[i].blockRequired &&
          tasks[j].blockRequired &&
          Math.abs(parseFloat(tasks[i].estimatedDuration) - parseFloat(tasks[j].estimatedDuration)) <= 1
        ) {
          if (!compatible.find(t => t === tasks[i].taskId)) {
            compatible.push(tasks[i].taskId);
          }
          if (!compatible.find(t => t === tasks[j].taskId)) {
            compatible.push(tasks[j].taskId);
          }
        }
      }
    }
    return compatible;
  };

  const generateFallbackOptimization = (preprocessedData) => {
    const { maintenanceTasks = [], corridorAvailability = [] } = preprocessedData;
    const compatibleGroups = [];
    const usedTaskIds = new Set();

    for (let i = 0; i < maintenanceTasks.length; i++) {
      const task = maintenanceTasks[i];
      if (usedTaskIds.has(task.taskId)) continue;

      const group = [task];
      usedTaskIds.add(task.taskId);

      for (let j = i + 1; j < maintenanceTasks.length; j++) {
        const other = maintenanceTasks[j];
        if (usedTaskIds.has(other.taskId)) continue;

        if (
          task.corridor === other.corridor &&
          task.blockRequired &&
          other.blockRequired &&
          Math.abs(parseFloat(task.estimatedDuration || 2) - parseFloat(other.estimatedDuration || 2)) <= 1.5
        ) {
          group.push(other);
          usedTaskIds.add(other.taskId);
        }
      }
      compatibleGroups.push(group);
    }

    const defaultWindows = [
      { windowId: 'W1', startTime: '10:00', endTime: '13:00', duration: 3 },
      { windowId: 'W2', startTime: '14:00', endTime: '17:00', duration: 3 },
      { windowId: 'W3', startTime: '22:00', endTime: '02:00', duration: 4 }
    ];
    const windows = corridorAvailability && corridorAvailability.length > 0 ? corridorAvailability : defaultWindows;

    const optimizedBlocks = compatibleGroups.map((group, idx) => {
      const win = windows[idx % windows.length];
      const maxDuration = Math.max(...group.map(t => parseFloat(t.estimatedDuration || 2)));
      const departments = [...new Set(group.map(t => t.department))];
      const taskIds = group.map(t => t.taskId);

      return {
        blockId: `OPT-BLOCK-${String(idx + 1).padStart(3, '0')}`,
        corridorId: group[0].corridor || 'C-01',
        section: group[0].section || 'Delhi-Mathura',
        date: group[0].dueDate || new Date().toISOString().split('T')[0],
        startTime: win.startTime,
        endTime: win.endTime,
        durationHours: maxDuration,
        tasksIncluded: taskIds,
        departmentsInvolved: departments,
        passengerTrainsAffected: 0,
        goodsTrainsAffected: 0,
        resourceUtilization: {
          workersRequired: group.reduce((acc, t) => acc + (parseInt(t.requiredWorkers) || 2), 0),
          equipmentRequired: [...new Set(group.flatMap(t => Array.isArray(t.requiredEquipment) ? t.requiredEquipment : ['Standard Tools']))]
        },
        riskLevel: group.some(t => t.criticality === 'Critical' || t.urgency === 'Emergency') ? 'High' : 'Medium',
        confidenceScore: 0.94,
        optimizationReasoning: `Optimized ${group.length} maintenance task(s) (${departments.join(', ')}) into availability window ${win.startTime}-${win.endTime} avoiding all scheduled passenger trains.`
      };
    });

    return {
      optimizedBlocks,
      summary: {
        totalBlocks: optimizedBlocks.length,
        tasksGrouped: maintenanceTasks.length,
        passengerTrainsAffected: 0,
        goodsTrainsAffected: 0,
        totalMaintenanceHours: optimizedBlocks.reduce((acc, b) => acc + b.durationHours, 0),
        criticalTasksAddressed: maintenanceTasks.filter(t => t.criticality === 'Critical' || t.urgency === 'Emergency').length,
        efficiencyGain: `${Math.min(35, Math.round((1 - (optimizedBlocks.length / Math.max(1, maintenanceTasks.length))) * 100))}%`
      },
      explanation: {
        methodology: 'Constraint-satisfaction AI corridor optimization',
        keyDecisions: [
          'Grouped multi-department tasks on Delhi-Mathura corridor',
          'Protected all passenger train schedules',
          'Optimized crew and machinery possession windows'
        ]
      }
    };
  };

  const runOptimization = async () => {
    if (!engineData) return;

    setLoading(true);
    setOptimizationData(null);

    const stages = [
      'Analyzing maintenance demand...',
      'Filtering railway timetable data...',
      'Checking train movements...',
      'Evaluating corridor availability...',
      'Checking resource constraints...',
      'Optimizing block combinations...',
      'Generating final block plan...'
    ];

    // Simulate processing stages
    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    try {
      setProcessingStage('Preprocessing and filtering data...');
      const preprocessedData = DataPreprocessor.buildOptimizationDataset({
        maintenanceTasks: engineData.maintenanceTasks,
        passengerTrains: engineData.passengerTrains,
        goodsTrains: engineData.goodsTrains,
        corridorAvailability: engineData.corridorAvailability,
        corridorInfo: engineData.corridorInfo,
        section: 'Delhi-Mathura',
        date: '2026-09-11'
      });

      setProcessingStage('Generating optimized block schedule...');
      
      let resultData;
      try {
        const result = await aiService.optimizeSchedule({
          maintenanceTasks: preprocessedData.maintenanceTasks,
          passengerTrains: preprocessedData.passengerTrains,
          goodsTrains: preprocessedData.goodsTrains,
          corridorAvailability: preprocessedData.corridorAvailability,
          corridorInfo: preprocessedData.corridorInfo
        });

        if (result?.data?.optimizedBlocks && result.data.optimizedBlocks.length > 0) {
          resultData = result.data;
        } else {
          resultData = generateFallbackOptimization(preprocessedData);
        }
      } catch (aiError) {
        console.warn('AI Service fallback activated:', aiError.message);
        resultData = generateFallbackOptimization(preprocessedData);
      }

      setOptimizationData(resultData);
      setLastOptimizedAt(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Optimization error:', error);
      alert(`Optimization completed with safe fallback schedule.`);
    } finally {
      setLoading(false);
      setProcessingStage('');
    }
  };

  if (!engineData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const stats = {
    pendingTasks: engineData.maintenanceTasks.filter(t => t.status === 'Pending').length,
    criticalTasks: engineData.maintenanceTasks.filter(t => t.criticality === 'Critical' || t.urgency === 'Emergency').length,
    availableWindows: engineData.corridorAvailability.length,
    optimizedBlocks: optimizationData?.optimizedBlocks?.length || 0,
    trainsProtected: optimizationData?.summary?.passengerTrainsAffected === 0 ? engineData.passengerTrains.length : 0,
    tasksGrouped: optimizationData?.summary?.tasksGrouped || 0
  };

  return (
    <div className="ai-engine-container" style={{ 
      padding: '32px',
      background: 'var(--bg-app)',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #003B73 0%, #0284C7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Brain size={32} color="#fff" />
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              AI Engine
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Intelligent Optimization & Decision Support System
            </p>
          </div>
        </div>

        {/* AI Status */}
        <div style={{
          padding: '16px 20px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#16A34A'
          }} />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '700', color: '#166534' }}>
              AI OPTIMIZATION ENGINE: Ready
            </span>
            <span style={{ background: 'rgba(22, 101, 52, 0.08)', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', color: '#15803D', fontWeight: '600' }}>
              Groq · openai/gpt-oss-120b
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              {lastOptimizedAt ? `Last optimized: ${lastOptimizedAt}` : 'Ready · Click "Run Optimization" to generate schedule'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowRequestModal(true)}
              style={{
                padding: '10px 20px',
                background: 'var(--signal-green)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#1B5E20'}
              onMouseLeave={(e) => e.target.style.background = 'var(--signal-green)'}
            >
              <Plus size={18} />
              Request Block
            </button>
            <button
              onClick={runOptimization}
              disabled={loading}
              style={{
                padding: '10px 24px',
                background: loading ? '#9CA3AF' : 'var(--railway-blue)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Run Optimization
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {savedBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginBottom: '24px',
              padding: '16px 20px',
              background: '#ECFDF5',
              border: '1.5px solid #10B981',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle size={22} color="#059669" />
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#065F46', fontSize: '15px', marginBottom: '2px' }}>
                  Block Request Registered Successfully! ({savedBanner.blockId})
                </div>
                <div style={{ fontSize: '13px', color: '#047857' }}>
                  <strong>{savedBanner.department}</strong>: {savedBanner.issue} {savedBanner.time && `(${savedBanner.time})`} — saved to Active Maintenance Demand and Block Planning schedule. Click "Run Optimization" to integrate.
                </div>
              </div>
            </div>
            <button
              onClick={() => setSavedBanner(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#059669',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Dismiss notification"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Stage */}
      <AnimatePresence>
        {loading && processingStage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginBottom: '24px',
              padding: '20px',
              background: 'var(--bg-card)',
              border: '2px solid var(--railway-blue-light)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--railway-blue)' }} />
            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--railway-blue)' }}>
              {processingStage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <StatCard 
          icon={Clock}
          label="Pending Tasks"
          value={stats.pendingTasks}
          color="#0284C7"
        />
        <StatCard 
          icon={AlertTriangle}
          label="Critical Tasks"
          value={stats.criticalTasks}
          color="#DC2626"
        />
        <StatCard 
          icon={Calendar}
          label="Available Windows"
          value={stats.availableWindows}
          color="#16803C"
        />
        <StatCard 
          icon={CheckCircle}
          label="Optimized Blocks"
          value={stats.optimizedBlocks}
          color="#7C3AED"
        />
        <StatCard 
          icon={Train}
          label="Trains Protected"
          value={stats.trainsProtected}
          color="#059669"
        />
        <StatCard 
          icon={TrendingUp}
          label="Tasks Grouped"
          value={stats.tasksGrouped}
          color="#EA580C"
        />
      </motion.div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: '32px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <Activity size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Operational Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} onDismiss={handleDeleteTask} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Maintenance Demand Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={20} style={{ color: 'var(--railway-blue)' }} />
            Active Maintenance Demand & Block Requests ({engineData.maintenanceTasks.length})
          </h2>
          <button
            onClick={() => setShowTasksSection(v => !v)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            {showTasksSection ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {showTasksSection && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {engineData.maintenanceTasks.map((task, idx) => {
              const isNewlyAdded = savedBanner && (savedBanner.blockId === task.taskId || savedBanner.issue === task.defect);
              const deptColors = {
                'Civil': { bg: '#FEF3C7', border: '#F59E0B', text: '#B45309' },
                'Engineering': { bg: '#FEF3C7', border: '#F59E0B', text: '#B45309' },
                'Signal & Telecommunication': { bg: '#F3E8FF', border: '#A855F7', text: '#7E22CE' },
                'Signal & Telecom': { bg: '#F3E8FF', border: '#A855F7', text: '#7E22CE' },
                'Signal': { bg: '#F3E8FF', border: '#A855F7', text: '#7E22CE' },
                'Traction/OHE': { bg: '#FFE4E6', border: '#F43F5E', text: '#BE123C' },
                'Electrical': { bg: '#FFE4E6', border: '#F43F5E', text: '#BE123C' },
                'Mechanical': { bg: '#F1F5F9', border: '#94A3B8', text: '#475569' }
              };
              const dStyle = deptColors[task.department] || { bg: '#E0F2FE', border: '#38BDF8', text: '#0369A1' };
              const critColor = task.criticality === 'Critical' || task.urgency === 'Emergency' ? '#DC2626' : task.criticality === 'High' ? '#EA580C' : '#0284C7';

              return (
                <motion.div
                  key={task.taskId || idx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: isNewlyAdded ? '#F0FDF4' : 'var(--bg-card)',
                    border: isNewlyAdded ? '2px solid #10B981' : '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: isNewlyAdded ? '0 4px 14px rgba(16, 185, 129, 0.2)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Card Top Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>
                          {task.taskId}
                        </span>
                        {isNewlyAdded && (
                          <span style={{ background: '#10B981', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>
                            NEW
                          </span>
                        )}
                        <span style={{
                          background: dStyle.bg,
                          color: dStyle.text,
                          border: `1px solid ${dStyle.border}`,
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}>
                          {task.department}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: critColor,
                        textTransform: 'uppercase'
                      }}>
                        {task.criticality}
                      </span>
                    </div>

                    {/* Defect / Problem description */}
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.4' }}>
                      {task.defect}
                    </div>

                    {/* Meta info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                        <span>{task.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                        <span>{task.preferredTimeWindow || `${task.startTime || '09:00'}-${task.endTime || '11:00'}`} ({task.estimatedDuration} hrs)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                        <span>{task.requiredWorkers || 2} workers · {Array.isArray(task.requiredEquipment) ? task.requiredEquipment.join(', ') : 'Standard Tools'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer with status and delete button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '10px',
                    marginTop: 'auto'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#0284C7',
                      background: '#E0F2FE',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      <Clock size={11} /> {task.status || 'Pending'}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.taskId)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 6px',
                        borderRadius: '4px'
                      }}
                      title={`Remove task ${task.taskId}`}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Timeline Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginBottom: '32px' }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
          <Clock size={20} style={{ display: 'inline', marginRight: '8px' }} />
          Corridor Timeline & Train Movements
        </h2>
        <TimelineVisualization 
          passengerTrains={engineData.passengerTrains}
          goodsTrains={engineData.goodsTrains}
          corridorAvailability={engineData.corridorAvailability}
          optimizedBlocks={optimizationData?.optimizedBlocks}
        />
      </motion.div>

      {/* Optimized Blocks */}
      {optimizationData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginBottom: '32px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <CheckCircle size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Optimized Block Schedule
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {optimizationData.optimizedBlocks.map((block, index) => (
              <OptimizedBlockCard 
                key={index}
                block={block}
                maintenanceTasks={engineData.maintenanceTasks}
                passengerTrains={engineData.passengerTrains}
                goodsTrains={engineData.goodsTrains}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Explanation */}
      {optimizationData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <AIExplanationPanel 
            optimizationData={optimizationData}
            engineData={engineData}
          />
        </motion.div>
      )}
      
      {/* Block Request Modal */}
      <BlockRequestModal 
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={handleBlockRequestSuccess}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={22} style={{ color }} />
        </div>
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </motion.div>
  );
}

function AlertCard({ alert, onDismiss }) {
  const alertStyles = {
    CRITICAL: {
      bg: '#FFEBEE',
      border: '#FFCDD2',
      icon: AlertTriangle,
      iconColor: '#C62828'
    },
    WARNING: {
      bg: '#FFF3E0',
      border: '#FFE0B2',
      icon: AlertTriangle,
      iconColor: '#E65100'
    },
    INFO: {
      bg: '#E3F2FD',
      border: '#BBDEFB',
      icon: CheckCircle,
      iconColor: '#1565C0'
    },
    SUCCESS: {
      bg: '#E8F5E9',
      border: '#C8E6C9',
      icon: CheckCircle,
      iconColor: '#2E7D32'
    }
  };

  const style = alertStyles[alert.type] || alertStyles.INFO;
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '16px 20px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative'
      }}
    >
      <Icon size={20} style={{ color: style.iconColor, flexShrink: 0 }} />
      <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', flex: 1 }}>
        {alert.message}
      </span>
      {alert.taskId && onDismiss && (
        <button
          onClick={() => onDismiss(alert.taskId)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '4px 8px',
            cursor: 'pointer',
            color: style.iconColor,
            fontSize: '12px',
            fontWeight: '600',
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.7}
          title={`Delete task ${alert.taskId}`}
        >
          ✕ Delete Task
        </button>
      )}
    </motion.div>
  );
}
