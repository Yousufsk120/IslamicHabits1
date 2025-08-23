'use client';

import { useEffect, useState } from 'react';
import { formatTime, getTimeUntil } from '@/lib/utils';

export function NextPrayerCard() {
  const [timeUntil, setTimeUntil] = useState('00:00:00');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock prayer times - in real app, this would come from prayer calculation
  const nextPrayer = {
    name: 'Maghrib',
    time: new Date(2024, 7, 23, 18, 45, 0), // 6:45 PM
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTimeUntil(getTimeUntil(nextPrayer.time));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer.time]);

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Next Prayer</h2>
        <div className="text-3xl font-bold mb-1">{nextPrayer.name}</div>
        <div className="text-lg opacity-90 mb-4">
          {formatTime(nextPrayer.time)}
        </div>
        <div className="text-2xl font-mono tracking-wider">
          {timeUntil}
        </div>
        <div className="text-sm opacity-75 mt-2">until {nextPrayer.name}</div>
      </div>
    </div>
  );
}