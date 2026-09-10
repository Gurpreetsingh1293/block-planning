import React from 'react';
import Hero from '../components/home/Hero';
import OperationsOverview from '../components/home/OperationsOverview';
import TimetablePreview from '../components/home/TimetablePreview';
import HowItWorks from '../components/home/HowItWorks';
import IntelligenceSection from '../components/home/IntelligenceSection';

export default function Home() {
  return (
    <div className="home-page-container">
      {/* 1. Hero Section with Headline, Dashboard Console & Floating Cards */}
      <Hero />

      {/* 2. Three Operational Views Overview */}
      <OperationsOverview />

      {/* 3. Station Timetable Operations Board */}
      <div className="home-section-container">
        <TimetablePreview />
      </div>

      {/* 4. How It Works 4-Step Process */}
      <HowItWorks />

      {/* 5. Smarter Decisions AI Intelligence Engine */}
      <IntelligenceSection />
    </div>
  );
}
