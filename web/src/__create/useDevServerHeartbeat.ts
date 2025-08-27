import { useEffect } from 'react';

export function useDevServerHeartbeat() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      window.parent.postMessage(
        {
          type: 'sandbox:web:heartbeat',
          timestamp: Date.now(),
        },
        '*'
      );
    }, 30000); // Send heartbeat every 30 seconds

    return () => clearInterval(interval);
  }, []);
}