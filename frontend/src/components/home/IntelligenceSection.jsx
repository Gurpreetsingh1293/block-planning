import React from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function IntelligenceSection() {
  const considerations = [
    'Maintenance priority',
    'Asset criticality',
    'Block availability',
    'Passenger movement',
    'Freight movement',
    'Department coordination',
    'Maintenance duration',
    'Operational conflicts'
  ];

  return (
    <section className="intelligence-engine-section">
      <div className="intelligence-container">
        {/* Left: Smarter Decisions list */}
        <div className="intelligence-content-left">
          <div className="intelligence-eyebrow">
            <Sparkles size={16} />
            <span>AI-POWERED CORRIDOR SYNCHRONIZATION</span>
          </div>

          <h2 className="intelligence-heading">Smarter Decisions. Better Blocks.</h2>

          <p className="intelligence-subtext">
            Dynamic scheduling algorithms continuously evaluate real-time movement and infrastructure parameters to prevent network bottlenecks.
          </p>

          <div className="considerations-grid">
            {considerations.map((item, idx) => (
              <div key={idx} className="consideration-item">
                <div className="check-icon-circle">
                  <Check size={14} />
                </div>
                <span className="consideration-label">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual Card with exact required copy */}
        <div className="intelligence-card-right">
          <div className="ai-recommendation-showcase-card">
            <div className="showcase-card-header">
              <div className="ai-rec-title-wrap">
                <Zap size={18} className="text-accent-cyan" />
                <span className="ai-rec-heading">AI RECOMMENDATION</span>
              </div>
              <span className="ai-confidence-pill">High Optimization</span>
            </div>

            <div className="showcase-card-body">
              <div className="rec-parameter-row">
                <span className="rec-param-label">Current Block:</span>
                <span className="rec-param-value">10:00–12:00</span>
              </div>

              <div className="rec-parameter-row alert-row">
                <span className="rec-param-label">Freight Conflict:</span>
                <span className="rec-param-value text-accent-red">11:15</span>
              </div>

              <div className="rec-recommendation-box">
                <div className="rec-target-label">Recommended:</div>
                <div className="rec-target-time">13:00–15:00</div>
              </div>

              <div className="rec-impact-summary">
                <span className="impact-title">Expected impact:</span>
                <span className="impact-highlight">LOWER OPERATIONAL CONFLICT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
