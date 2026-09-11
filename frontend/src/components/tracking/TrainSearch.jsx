import React, { useState, useRef, useEffect } from 'react';
import { Search, Train, MapPin, X, ArrowRight, Loader2 } from 'lucide-react';

export default function TrainSearch({
  searchValue,
  onSearchChange,
  searchResults = [],
  onSelectTrain,
  isSearching = false,
  stationFilter,
  onStationChange,
  stations = []
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (train) => {
    if (onSelectTrain) {
      onSelectTrain(train);
    }
    if (onSearchChange) {
      onSearchChange(train.number ? `${train.number} - ${train.name}` : train.name);
    }
    setIsOpen(false);
  };

  return (
    <div className="tracking-search-controls-bar" ref={containerRef}>
      {/* Search Train with Dropdown */}
      <div className="search-input-field">
        <Train size={16} className="search-field-icon" />
        <input
          type="text"
          placeholder="Search Train Number or Name (e.g. 12002, Bhopal Shatabdi)..."
          value={searchValue}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchValue || searchResults.length > 0) {
              setIsOpen(true);
            }
          }}
          className="search-text-input"
        />
        {isSearching && (
          <Loader2 size={14} className="search-field-icon animate-spin" />
        )}
        {searchValue && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => {
              onSearchChange('');
              setIsOpen(false);
            }}
          >
            <X size={14} />
          </button>
        )}

        {/* Auto-Complete Dropdown */}
        {isOpen && searchValue && searchValue.trim().length > 0 && (
          <div className="search-dropdown-menu">
            {searchResults.length > 0 ? (
              searchResults.map((train) => (
                <div
                  key={train.id || train.number}
                  className="search-result-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(train);
                  }}
                  onClick={() => handleSelect(train)}
                >
                  <div className="result-train-left">
                    <span className="result-train-num">{train.number}</span>
                    <div className="result-train-info">
                      <span className="result-train-name">{train.name}</span>
                      <span className="result-train-route">
                        {train.source || 'Source'} <ArrowRight size={11} /> {train.destination || 'Destination'}
                      </span>
                    </div>
                  </div>
                  <span className="result-train-type">{train.type || 'EXPRESS'}</span>
                </div>
              ))
            ) : (
              !isSearching && (
                <div className="search-empty-result">
                  No active trains found matching "<strong>{searchValue}</strong>"
                </div>
              )
            )}
          </div>
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

