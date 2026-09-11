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
  Plus
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
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      // IMPORTANT: Use deterministic preprocessor BEFORE sending to AI
      // This filters and normalizes data so the LLM acts as an optimization engine,
      // NOT a database query engine
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

      setProcessingStage('Sending to AI optimization engine...');
      
      // Send ONLY the preprocessed, filtered dataset to Groq
      const result = await aiService.optimizeSchedule({
        maintenanceTasks: preprocessedData.maintenanceTasks,
        passengerTrains: preprocessedData.passengerTrains,
        goodsTrains: preprocessedData.goodsTrains,
        corridorAvailability: preprocessedData.corridorAvailability,
        corridorInfo: preprocessedData.corridorInfo
      });

      setOptimizationData(result.data);
    } catch (error) {
      console.error('Optimization error:', error);
      alert(`Optimization failed: ${error.message}\n\nPlease ensure:\n1. Backend server is running\n2. GROQ_API_KEY is configured in backend/.env`);
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
          background: aiStatus?.aiServiceAvailable ? '#E8F5E9' : '#FFF3E0',
          border: `1px solid ${aiStatus?.aiServiceAvailable ? '#A5D6A7' : '#FFCC80'}`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: aiStatus?.aiServiceAvailable ? '#4CAF50' : '#FF9800',
            animation: aiStatus?.aiServiceAvailable ? 'pulse 2s infinite' : 'none'
          }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              AI ENGINE: {aiStatus?.aiServiceAvailable ? 'Operational' : 'Checking...'}
            </span>
            <span style={{ marginLeft: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Last optimization: {new Date().toLocaleTimeString()}
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
              disabled={loading || !aiStatus?.aiServiceAvailable}
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
