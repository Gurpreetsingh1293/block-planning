import React from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export default function OptimizationSuggestion({
  conflict,
  onApply,
  optimizing,
  applied
}) {
  if (applied) {
    return (
      <div className="optimization-applied-card">
        <div className="applied-header">
          <CheckCircle2 size={18} className="text-signal-green" />
          <h4 className="applied-title">Schedule Conflict Resolved</h4>
        </div>
        <p className="applied-desc">
          TRD OHE Maintenance shifted to <strong>13:00–15:00</strong>. Zero detention achieved for both passenger express corridors and Freight 70521.
        </p>
      </div>
    );
  }

  if (!conflict) return null;

  return (
    <div className="ai-optimization-suggestion-card">
      <div className="suggestion-card-header">
        <div className="suggestion-title-group">
          <Zap size={15} className="text-railway-blue" />
          <h4 className="suggestion-title">AI Recommendation</h4>
        </div>
        <span className="suggestion-badge">High Impact</span>
      </div>

      <div className="suggestion-card-body">
        <div className="window-comparison-row">
          <div className="window-box current-box">
            <span className="window-label">Current Window</span>
            <span className="window-time">{conflict.currentWindow}</span>
            <span className="window-tag-conflict">Conflict @ {conflict.conflictTime}</span>
          </div>

          <ArrowRight size={16} className="comparison-arrow" />

          <div className="window-box recommended-box">
            <span className="window-label">Recommended Window</span>
            <span className="window-time">{conflict.suggestedWindow}</span>
            <span className="window-tag-clean">Zero Conflict</span>
          </div>
        </div>

        <div className="suggestion-reason-block">
          <span className="reason-label">Optimization Analysis:</span>
          <p className="reason-text">{conflict.aiReason}</p>
        </div>

        <div className="expected-impact-strip">
          <span className="impact-title">Expected impact:</span>
          <span className="impact-badge">{conflict.expectedImpact}</span>
        </div>
      </div>
    </div>
  );
}
