import React from 'react';
import { AlertTriangle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export default function ConflictAlert({
  conflict,
  onApplyOptimization,
  optimizing = false
}) {
  if (!conflict) return null;

  return (
    <div className="conflict-alert-banner">
      <div className="conflict-alert-content">
        <div className="alert-badge-group">
          <div className="alert-icon-ring">
            <AlertTriangle size={18} />
          </div>
          <div className="alert-titles">
            <h4 className="alert-main-title">{conflict.title}</h4>
            <div className="alert-sub-meta">
              <span className="meta-section">{conflict.section}</span>
              <span className="meta-divider">•</span>
              <span className="meta-window">{conflict.currentWindow}</span>
            </div>
          </div>
        </div>

        <div className="conflict-explanation">
          <p className="conflict-desc-text">
            Scheduled TRD OHE Maintenance at <strong>{conflict.currentWindow}</strong> overlaps with{' '}
            <strong>{conflict.conflictingTraffic}</strong> at {conflict.conflictTime}.
          </p>
        </div>
      </div>

      <div className="conflict-action-box">
        <Button
          variant="primary"
          size="md"
          icon={Sparkles}
          onClick={() => onApplyOptimization(conflict.id)}
          disabled={optimizing}
          className="btn-apply-suggestion"
        >
          {optimizing ? 'Recalculating Paths...' : `Move to ${conflict.suggestedWindow} (AI Optimized)`}
        </Button>
      </div>
    </div>
  );
}
