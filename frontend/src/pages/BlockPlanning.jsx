import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import BlockPlanner from '../components/blockPlanning/BlockPlanner';

export default function BlockPlanning() {
  return (
    <div className="block-planning-page-container">
      {/* 1. Feature Introduction */}
      <PageHeader
        title="Plan Blocks Like a Control Room."
        subtitle="Bring maintenance requirements and railway movement into one coordinated planning view."
        chips={[
          'Multi-Department Coordination',
          'Freight Bottleneck Elimination',
          'AI Conflict Detection',
          'Asset Health Synchronization'
        ]}
      />

      {/* 2. Full-Width Block Planner Workspace */}
      <div className="block-planning-workspace-wrapper">
        <BlockPlanner />
      </div>
    </div>
  );
}
