'use client';

import { useEffect, useState } from 'react';
import { formatTime, getTimeUntil } from '@/lib/utils';

interface NextPrayerData {
  name: string;
  time: string;
  remaining: string;
}

interface PrayerTimesResponse {
  nextPrayer: NextPrayerData;
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export function NextPrayerCard() {
  const [nextPrayer, setNextPrayer] = useState<NextPrayerData | null>(null);
  const [timeUntil, setTimeUntil] = useState('00:00:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        // Using default coordinates for Dhaka, Bangladesh
        const response = await fetch('/api/prayer/today?lat=23.8103&lng=90.4125&tz=Asia/Dhaka&method=Karachi&asr=Hanafi');
        const data: PrayerTimesResponse = await response.json();
        
        if (data.nextPrayer) {
          setNextPrayer(data.nextPrayer);
        }
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
        // Fallback to mock data
        setNextPrayer({
          name: 'Maghrib',
          time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          remaining: '02:00:00'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    if (!nextPrayer) return;

    const timer = setInterval(() => {
      const prayerTime = new Date(nextPrayer.time);
      setTimeUntil(getTimeUntil(prayerTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-green-400 rounded mb-2"></div>
            <div className="h-8 bg-green-400 rounded mb-1"></div>
            <div className="h-6 bg-green-400 rounded mb-4"></div>
            <div className="h-8 bg-green-400 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!nextPrayer) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Prayer Times</h2>
          <p className="text-sm opacity-90">Unable to load prayer times</p>
          <p className="text-xs opacity-75 mt-2">Please check your connection</p>
        </div>
      </div>
    );
  }

  const prayerTime = new Date(nextPrayer.time);

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Next Prayer</h2>
        <div className="text-3xl font-bold mb-1">{nextPrayer.name}</div>
        <div className="text-lg opacity-90 mb-4">
          {formatTime(prayerTime)}
        </div>
        <div className="text-2xl font-mono tracking-wider">
          {timeUntil}
        </div>
        <div className="text-sm opacity-75 mt-2">until {nextPrayer.name}</div>
      </div>
    </div>
  );
}