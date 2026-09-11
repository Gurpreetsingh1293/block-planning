import React from 'react';
import TeamsCalendarTimeline from '../components/blockPlanning/TeamsCalendarTimeline';

/**
 * Block Planning Page — Full-screen Microsoft Teams-style calendar
 * Connected to MongoDB + Socket.io real-time sync
 */
export default function BlockPlanning() {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <TeamsCalendarTimeline />
    </div>
  );
}
