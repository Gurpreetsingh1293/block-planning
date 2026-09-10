import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import { Sparkles, ScanLine, Cpu, Activity, Clock, ShieldCheck } from 'lucide-react';

export default function ComingSoon() {
  const upcomingModules = [
    {
      title: 'Predictive Track & OHE Health',
      tag: 'IoT Telemetry',
      desc: 'Real-time track vibration, rail temperature, and pantograph contact wire wear telemetry stream ingestion directly into maintenance scheduling queues.',
      icon: Activity,
      status: 'In Development'
    },
    {
      title: 'OCR Caution Order & Work Order Digitize',
      tag: 'Computer Vision',
      desc: 'Automated extraction of paper station caution orders, speed restriction notices, and physical engineering permits using Indian Railways standardized format parsers.',
      icon: ScanLine,
      status: 'Planned'
    },
    {
      title: 'OR-Tools Multi-Divisional Interlocking Engine',
      tag: 'Operations Research',
      desc: 'Cross-divisional block negotiation with automated route locking and simultaneous freight routing across Northern and Western corridors.',
      icon: Cpu,
      status: 'Research Phase'
    }
  ];

  return (
    <div className="coming-soon-page-container">
      <PageHeader
        title="Enterprise Expansion Modules"
        subtitle="Advanced operational capabilities in development for Indian Railways network control."
        chips={['Next-Gen Control Room', 'Automated Permit Ingestion', 'Hardware Sensor Feeds']}
      />

      <div className="coming-soon-grid">
        {upcomingModules.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} hoverable className="coming-soon-card">
              <div className="coming-soon-card-header">
                <div className="coming-soon-icon-box">
                  <Icon size={22} className="text-accent-cyan" />
                </div>
                <span className="coming-soon-status-badge">{item.status}</span>
              </div>

              <div className="coming-soon-card-body">
                <span className="coming-soon-category-tag">{item.tag}</span>
                <h3 className="coming-soon-card-title">{item.title}</h3>
                <p className="coming-soon-card-desc">{item.desc}</p>
              </div>

              <div className="coming-soon-footer">
                <div className="progress-timeline-bar">
                  <div className="progress-fill" style={{ width: idx === 0 ? '65%' : idx === 1 ? '30%' : '15%' }} />
                </div>
                <span className="progress-label">Module Readiness</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
