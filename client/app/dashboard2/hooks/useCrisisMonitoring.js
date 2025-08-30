import { useState, useEffect, useCallback } from 'react';
import { 
  getCrisisStatus, 
  getCrisisDataInfo, 
  startCrisisMonitoring, 
  stopCrisisMonitoring 
} from '../../services/api';

export const useCrisisMonitoring = () => {
  const [crisisData, setCrisisData] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch crisis data info
  const fetchCrisisDataInfo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCrisisDataInfo();
      return response.data;
    } catch (err) {
      console.error('Error fetching crisis data info:', err);
      setError('Failed to fetch crisis data information');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current crisis status
  const fetchCrisisStatus = useCallback(async () => {
    try {
      const response = await getCrisisStatus();
      const data = response.data;
      
      if (data.error) {
        setError(data.error);
        return null;
      }
      
      setCrisisData(data);
      setLastUpdate(new Date(data.timestamp));
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching crisis status:', err);
      setError('Failed to fetch crisis status');
      return null;
    }
  }, []);

  // Start crisis monitoring
  const startMonitoring = useCallback(async () => {
    try {
      setLoading(true);
      const response = await startCrisisMonitoring();
      
      if (response.data.message) {
        setIsMonitoring(true);
        setError(null);
        return true;
      }
    } catch (err) {
      console.error('Error starting crisis monitoring:', err);
      setError('Failed to start crisis monitoring');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Stop crisis monitoring
  const stopMonitoring = useCallback(async () => {
    try {
      setLoading(true);
      const response = await stopCrisisMonitoring();
      
      if (response.data.message) {
        setIsMonitoring(false);
        setError(null);
        return true;
      }
    } catch (err) {
      console.error('Error stopping crisis monitoring:', err);
      setError('Failed to stop crisis monitoring');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh crisis status when monitoring is active
  useEffect(() => {
    let interval;
    
    if (isMonitoring) {
      // Fetch initial status
      fetchCrisisStatus();
      
      // Set up 5-second interval for updates
      interval = setInterval(() => {
        fetchCrisisStatus();
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMonitoring, fetchCrisisStatus]);

  // Initialize crisis data info on mount
  useEffect(() => {
    fetchCrisisDataInfo();
  }, [fetchCrisisDataInfo]);

  return {
    crisisData,
    isMonitoring,
    loading,
    error,
    lastUpdate,
    startMonitoring,
    stopMonitoring,
    fetchCrisisStatus,
    fetchCrisisDataInfo
  };
};
