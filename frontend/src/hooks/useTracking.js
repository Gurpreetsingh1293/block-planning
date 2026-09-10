import { useState, useEffect, useCallback } from 'react';
import { getLiveMovement, getTrackingMetrics, getCorridors } from '../services/trackingService';

export function useTracking(initialView = 'PASSENGER') {
  const [viewType, setViewType] = useState(initialView); // 'PASSENGER' | 'CARGO'
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [corridors, setCorridors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchTrackingData = useCallback(async () => {
    setLoading(true);
    try {
      const [liveTrains, trackingMetrics, corridorData] = await Promise.all([
        getLiveMovement(viewType),
        getTrackingMetrics(),
        getCorridors()
      ]);

      setTrains(liveTrains);
      setMetrics(trackingMetrics);
      setCorridors(corridorData);

      // Default select the first train if none selected or if view type changed
      if (liveTrains && liveTrains.length > 0) {
        setSelectedTrain(liveTrains[0]);
      }
    } catch (err) {
      console.error('Error in useTracking:', err);
    } finally {
      setLoading(false);
    }
  }, [viewType]);

  useEffect(() => {
    fetchTrackingData();
  }, [fetchTrackingData]);

  // Filtered trains
  const filteredTrains = trains.filter((t) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase().trim();
    return (
      t.number.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.currentStation.toLowerCase().includes(q) ||
      t.nextStation.toLowerCase().includes(q)
    );
  });

  return {
    viewType,
    setViewType,
    trains: filteredTrains,
    allTrains: trains,
    selectedTrain,
    setSelectedTrain,
    metrics,
    corridors,
    loading,
    searchFilter,
    setSearchFilter,
    refetch: fetchTrackingData
  };
}
