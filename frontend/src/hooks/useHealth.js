import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

export function useHealth(pollIntervalMs = 30000) {
  const [isOnline, setIsOnline] = useState(null);
  const [checking, setChecking] = useState(true);

  const checkHealth = async () => {
    try {
      const res = await apiService.getHealth();
      setIsOnline(res.status === 'healthy' || res.status === 'ok');
    } catch {
      setIsOnline(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, pollIntervalMs);
    return () => clearInterval(interval);
  }, [pollIntervalMs]);

  return { isOnline, checking, refetchHealth: checkHealth };
}
