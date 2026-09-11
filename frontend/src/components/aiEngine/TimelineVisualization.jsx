import React from 'react';
import { motion } from 'framer-motion';
import { Train, Package, Wrench } from 'lucide-react';

export default function TimelineVisualization({ 
  passengerTrains, 
  goodsTrains, 
  corridorAvailability,
  optimizedBlocks 
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTimePosition = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return ((hours + minutes / 60) / 24) * 100;
  };

  const getTrainOccupancy = (hour) => {
    const trains = [];
    const hourStart = `${String(hour).padStart(2, '0')}:00`;
    const hourEnd = `${String(hour).padStart(2, '0')}:59`;

    passengerTrains.forEach(train => {
      if (train.stations && train.stations.length > 0) {
        const departure = train.stations[0]?.departureTime;
        const arrival = train.stations[train.stations.length - 1]?.arrivalTime;
        
        if (departure && isTimeInHour(departure, hour)) {
          trains.push({ ...train, type: 'passenger' });
        } else if (arrival && isTimeInHour(arrival, hour)) {
          trains.push({ ...train, type: 'passenger' });
        }
      }
    });

    return trains;
  };

  const isTimeInHour = (time, hour) => {
    const [h] = time.split(':').map(Number);
    return h === hour;
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      overflowX: 'auto'
    }}>
      <div style={{ minWidth: '1200px' }}>
        {/* Time Ruler */}
        <div style={{
          display: 'flex',
          marginBottom: '16px',
          borderBottom: '2px solid var(--border-medium)',
          paddingBottom: '8px'
        }}>
          {hours.map(hour => (
            <div
              key={hour}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)'
              }}
            >
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Passenger Trains Row */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Train size={16} />
            Passenger Trains
          </div>
          <div style={{
            height: '40px',
            background: 'var(--bg-surface-alt)',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex'
          }}>
            {hours.map(hour => {
              const trains = getTrainOccupancy(hour);
              return (
                <div
                  key={hour}
                  style={{
                    flex: 1,
                    borderRight: '1px solid var(--border-subtle)',
                    position: 'relative'
                  }}
                >
                  {trains.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '28px',
                        height: '28px',
                        background: '#1976D2',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                      }}
                      title={trains.map(t => `${t.trainNumber} ${t.trainName}`).join(', ')}
                    >
                      🚆
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Goods Trains Row */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Package size={16} />
            Goods Trains
          </div>
          <div style={{
            height: '40px',
            background: 'var(--bg-surface-alt)',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex'
          }}>
            {hours.map(hour => (
              <div
                key={hour}
                style={{
                  flex: 1,
                  borderRight: '1px solid var(--border-subtle)',
                  position: 'relative'
                }}
              >
                {goodsTrains.some(g => {
                  const [h] = g.expectedDeparture.split(':').map(Number);
                  return h === hour;
                }) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '28px',
                      height: '28px',
                      background: '#F57C00',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '18px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(245, 124, 0, 0.3)'
                    }}
                  >
                    📦
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Corridor Availability Row */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Corridor Availability
          </div>
          <div style={{
            height: '40px',
            background: 'var(--bg-surface-alt)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {corridorAvailability.map((window, index) => {
              const startPos = getTimePosition(window.availableFrom);
              const endPos = getTimePosition(window.availableUntil);
              const width = endPos - startPos;

              return (
                <motion.div
                  key={index}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    position: 'absolute',
                    left: `${startPos}%`,
                    width: `${width}%`,
                    height: '100%',
                    background: window.trafficDensity === 'Low' 
                      ? 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)'
                      : window.trafficDensity === 'Medium'
                      ? 'linear-gradient(90deg, #FFA726 0%, #FFB74D 100%)'
                      : 'linear-gradient(90deg, #EF5350 0%, #E57373 100%)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  title={`${window.availableFrom} - ${window.availableUntil} (${window.trafficDensity})`}
                >
                  {window.trafficDensity}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Optimized Blocks Row */}
        {optimizedBlocks && optimizedBlocks.length > 0 && (
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Wrench size={16} />
              AI Recommended Blocks
            </div>
            <div style={{
              height: '50px',
              background: 'var(--bg-surface-alt)',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {optimizedBlocks.map((block, index) => {
                const startPos = getTimePosition(block.startTime);
                const endPos = getTimePosition(block.endTime);
                const width = endPos - startPos;

                const priorityColors = {
                  EMERGENCY: '#B71C1C',
                  CRITICAL: '#D32F2F',
                  HIGH: '#F57C00',
                  MEDIUM: '#FBC02D',
                  ROUTINE: '#388E3C'
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15, type: 'spring' }}
                    style={{
                      position: 'absolute',
                      left: `${startPos}%`,
                      width: `${width}%`,
                      height: '100%',
                      background: priorityColors[block.priority] || '#7C3AED',
                      borderRadius: '6px',
                      border: '2px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    title={`${block.blockId}: ${block.startTime} - ${block.endTime}`}
                  >
                    {block.blockId}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap'
        }}>
          <LegendItem color="#1976D2" label="Passenger Train" />
          <LegendItem color="#F57C00" label="Goods Train" />
          <LegendItem color="#4CAF50" label="Low Traffic" />
          <LegendItem color="#FFA726" label="Medium Traffic" />
          <LegendItem color="#EF5350" label="High Traffic" />
          <LegendItem color="#7C3AED" label="AI Block" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '16px',
        height: '16px',
        background: color,
        borderRadius: '4px'
      }} />
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </div>
  );
}
