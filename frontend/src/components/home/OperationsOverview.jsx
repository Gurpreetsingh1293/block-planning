import React from 'react';
import FeatureCard from './FeatureCard';
import { Clock, Navigation, Calendar } from 'lucide-react';

export default function OperationsOverview() {
  const views = [
    {
      id: 'station-timetable',
      title: 'Station Timetable',
      description: 'View scheduled arrivals, departures, platforms, delays, and upcoming train movements for any railway station.',
      icon: Clock,
      badge: 'Real-Time Feeds',
      linkTo: '/'
    },
    {
      id: 'live-tracking',
      title: 'Live Train Tracking',
      description: 'Monitor train movement in real time with dedicated passenger and cargo views.',
      icon: Navigation,
      badge: 'Passenger & Freight',
      linkTo: '/live-tracking'
    },
    {
      id: 'block-planning',
      title: 'Intelligent Block Planning',
      description: 'Coordinate maintenance blocks across Engineering, S&T, and TRD while considering train and freight movement.',
      icon: Calendar,
      badge: 'Multi-Department',
      linkTo: '/block-planning'
    }
  ];

  return (
    <div className="operations-overview-section">
      <div className="section-title-wrap">
        <h2 className="overview-headline">One Platform. Three Operational Views.</h2>
      </div>

      <div className="overview-cards-grid">
        {views.map((view) => (
          <FeatureCard key={view.id} {...view} />
        ))}
      </div>
    </div>
  );
}
