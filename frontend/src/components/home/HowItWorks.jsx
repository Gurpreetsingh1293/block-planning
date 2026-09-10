import React from 'react';
import { Database, Search, Cpu, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'COLLECT',
      desc: 'Timetable + maintenance + operational data',
      icon: Database
    },
    {
      step: '02',
      title: 'UNDERSTAND',
      desc: 'Identify maintenance priorities and operational constraints',
      icon: Search
    },
    {
      step: '03',
      title: 'OPTIMIZE',
      desc: 'Generate coordinated block plans',
      icon: Cpu
    },
    {
      step: '04',
      title: 'EXECUTE',
      desc: 'Assign work, capture evidence, and verify completion',
      icon: CheckCircle
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="section-title-wrap">
        <h2 className="how-it-works-title">How It Works</h2>
      </div>

      <div className="how-it-works-grid">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="workflow-step-card">
              <div className="step-header">
                <span className="step-index-badge">{item.step}</span>
                <div className="step-icon-wrapper">
                  <Icon size={18} />
                </div>
              </div>

              <div className="step-body">
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.desc}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="step-connector-line" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
