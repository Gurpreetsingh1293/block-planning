import React from 'react';
import { Search, Train, MapPin, X } from 'lucide-react';

export default function TrainSearch({
  searchValue,
  onSearchChange,
  stationFilter,
  onStationChange,
  stations = []
}) {
  return (
    <div className="tracking-search-controls-bar">
      {/* Search Train */}
      <div className="search-input-field">
        <Train size={16} className="search-field-icon" />
        <input
          type="text"
          placeholder="Search Train Number or Name..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-text-input"
        />
        {searchValue && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search Station */}
      <div className="search-input-field station-select-field">
        <MapPin size={16} className="search-field-icon" />
        <select
          value={stationFilter}
          onChange={(e) => onStationChange(e.target.value)}
          className="station-select-dropdown"
        >
          <option value="">All Stations (Search Station)</option>
          {stations.map((s) => (
            <option key={s.code} value={s.name}>
              {s.name} ({s.code})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
