import React from 'react';
import TrainMarker from './TrainMarker';
import { STATIONS } from '../../data/stations';
import { Layers, Compass, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function TrackingMap({
  trains = [],
  selectedTrain,
  onSelectTrain,
  viewType = 'PASSENGER'
}) {
  return (
    <div className="railway-schematic-map-container">
      {/* Map Overlay Tools & Legend */}
      <div className="map-legend-overlay">
        <div className="legend-item">
          <span className="legend-track line-quad" />
          <span>Quad Track (High Density)</span>
        </div>
        <div className="legend-item">
          <span className="legend-track line-double" />
          <span>Double Electrified</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-station" />
          <span>Major Junction</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-active-train" />
          <span>{viewType === 'CARGO' ? 'Freight Rake' : 'Passenger Train'}</span>
        </div>
      </div>

      {/* SVG Canvas for High-Precision Track Vectors */}
      <div className="schematic-canvas-area">
        <svg
          className="railway-network-svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="trackGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#003B73" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
            </linearGradient>
            <pattern id="lightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background grid for schematic control feel */}
          <rect width="1000" height="600" fill="url(#lightGrid)" />

          {/* Railway Trunk Lines */}
          {/* Trunk 1: Ghaziabad -> NDLS -> Mathura -> Agra -> Kota */}
          <path
            d="M 880 120 L 780 180 L 680 300 L 580 400 L 380 500"
            className="track-line-major"
            stroke="url(#trackGradLight)"
            strokeWidth="5.5"
            fill="none"
          />
          {/* Parallel sleeper markings for realistic IR schematic look */}
          <path
            d="M 880 120 L 780 180 L 680 300 L 580 400 L 380 500"
            className="track-ties"
            stroke="#94A3B8"
            strokeWidth="9"
            strokeDasharray="2 12"
            fill="none"
            opacity="0.45"
          />

          {/* Trunk 2: NDLS -> Kanpur Central */}
          <path
            d="M 780 180 L 540 210"
            className="track-line-branch"
            stroke="#16803C"
            strokeWidth="4"
            strokeDasharray="6 4"
            fill="none"
          />

          {/* Dedicated Freight Corridor Bypass line */}
          <path
            d="M 840 80 L 710 240 L 610 360 L 410 470"
            className="track-line-dfc"
            stroke="#D97706"
            strokeWidth="3"
            strokeDasharray="5 6"
            fill="none"
            opacity="0.85"
          />

          {/* Station Nodes on SVG */}
          {STATIONS.map((station) => {
            const svgX = station.coordinates.x * 10;
            const svgY = station.coordinates.y * 6;
            return (
              <g key={station.code} className="station-node-group" transform={`translate(${svgX}, ${svgY})`}>
                <circle r="10" className="station-outer-halo" />
                <circle r="5" className="station-inner-core" />
                <rect x="14" y="-12" width={station.name.length * 8.5 + 44} height="24" rx="6" className="station-tag-bg" />
                <text x="22" y="4" className="station-tag-label">
                  {station.name} ({station.code})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Interactive Dynamic Train Markers positioned over coordinates */}
        <div className="train-markers-layer">
          {trains.map((train) => (
            <TrainMarker
              key={train.id}
              train={train}
              isSelected={selectedTrain?.id === train.id}
              onClick={onSelectTrain}
            />
          ))}
        </div>
      </div>

      {/* Map Footer Bar */}
      <div className="map-status-strip">
        <span className="strip-title">SECTION: NORTHERN TRUNK HIGH-SPEED CORRIDOR</span>
        <span className="strip-meta">Signaling: Automatic Block Signaling (ABS) • Max Permissible: 160 km/h</span>
      </div>
    </div>
  );
}
