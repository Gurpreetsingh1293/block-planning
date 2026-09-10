import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import HeroDashboard from './HeroDashboard';
import FloatingCard from './FloatingCard';
import { Calendar, Navigation, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  const operationalChips = [
    'Live Operations',
    'Block Planning',
    'Freight-Aware',
    'Multi-Department'
  ];

  return (
    <section className="home-hero-section">
      {/* 1. Left Side: Intro & Headline Block */}
      <div className="hero-intro-container">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          <span>INTELLIGENT RAILWAY OPERATIONS</span>
        </div>

        <h1 className="hero-heading">
          Connecting Maintenance.<br />
          Coordinating Movement.
        </h1>

        <p className="hero-supporting-text">
          One intelligent platform for railway timetables, live movement, and coordinated maintenance block planning.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions-row">
          <Button
            variant="primary"
            size="lg"
            icon={Calendar}
            onClick={() => navigate('/block-planning')}
          >
            Open Control Dashboard
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={Navigation}
            iconPosition="right"
            onClick={() => navigate('/live-tracking')}
          >
            Explore Platform
          </Button>
        </div>

        {/* Operational Chips */}
        <div className="hero-chips-row">
          {operationalChips.map((chip, idx) => (
            <div key={idx} className="operational-chip">
              <span className="chip-dot" />
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Right Side: Layered Product Showcase & Floating Cards */}
      <div className="hero-visual-workspace">
        <div className="hero-showcase-backdrop">
          {/* Central Operations Dashboard */}
          <div className="hero-console-wrapper">
            <HeroDashboard />
          </div>

          {/* Layered Floating Cards around the Showcase */}
          <div className="floating-cards-layer">
            <div className="floating-card-slot slot-top-left">
              <FloatingCard type="block-optimized" />
            </div>

            <div className="floating-card-slot slot-top-right">
              <FloatingCard type="freight-alert" />
            </div>

            <div className="floating-card-slot slot-bottom-left">
              <FloatingCard type="maintenance" />
            </div>

            <div className="floating-card-slot slot-bottom-right">
              <FloatingCard type="ai-rec" />
            </div>

            <div className="floating-card-slot slot-mid-right">
              <FloatingCard type="live-status" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
