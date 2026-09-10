import React, { useState, useEffect } from 'react';
import StatusPill from '../common/StatusPill';
import { getStationTimetable } from '../../services/stationService';
import { Clock, MapPin, Calendar, RefreshCw } from 'lucide-react';

export default function TimetablePreview() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getStationTimetable('NDLS');
      setTimetable(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="station-timetable-preview-card">
      {/* Timetable Header */}
      <div className="timetable-card-top">
        <div className="timetable-title-group">
          <div className="timetable-icon-badge">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="timetable-main-heading">Station Operations</h3>
            <p className="timetable-sub-heading">Live arrival & departure platform monitor</p>
          </div>
        </div>

        <div className="timetable-meta-controls">
          <div className="station-selector-pill">
            <MapPin size={14} />
            <span>Station: <strong>NEW DELHI</strong></span>
          </div>

          <div className="date-selector-pill">
            <Calendar size={14} />
            <span>Date: <strong>TODAY</strong></span>
          </div>
        </div>
      </div>

      {/* Table Display */}
      <div className="timetable-table-container">
        <table className="station-operations-table">
          <thead>
            <tr>
              <th>TIME</th>
              <th>TRAIN</th>
              <th>FROM / TO</th>
              <th>PLATFORM</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="table-loading-cell">
                  Loading station operations board...
                </td>
              </tr>
            ) : (
              timetable?.entries.map((entry) => (
                <tr key={entry.id} className="timetable-row">
                  <td className="time-cell">
                    <span className="time-text">{entry.time}</span>
                  </td>
                  <td className="train-cell">
                    <div className="train-identity">
                      <span className="train-number-badge">{entry.trainNumber}</span>
                      <span className="train-name-text">{entry.trainName}</span>
                    </div>
                  </td>
                  <td className="route-cell">
                    <span className="route-text">{entry.route}</span>
                  </td>
                  <td className="platform-cell">
                    <span className="platform-pill">{entry.platform}</span>
                  </td>
                  <td className="status-cell">
                    <StatusPill status={entry.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
