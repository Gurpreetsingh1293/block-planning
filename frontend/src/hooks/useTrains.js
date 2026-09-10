import { useState, useEffect, useCallback } from 'react';
import { getTrains, searchTrains } from '../services/trainService';

export function useTrains(initialType = 'ALL') {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = searchQuery
        ? await searchTrains(searchQuery, type)
        : await getTrains(type);
      setTrains(data);
    } catch (err) {
      console.error('Error fetching trains:', err);
    } finally {
      setLoading(false);
    }
  }, [type, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    trains,
    loading,
    type,
    setType,
    searchQuery,
    setSearchQuery,
    refetch: loadData
  };
}
