import React, { useEffect, useState } from 'react';

export function HotReloadIndicator() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isConnected) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-md text-sm">
      Connection lost
    </div>
  );
}