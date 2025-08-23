'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils';
import { ArrowLeft, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';

interface PrayerTimesData {
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  nextPrayer: {
    name: string;
    time: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  method: string;
  asr: string;
}

const prayerNames = [
  { key: 'fajr', name: 'Fajr', arabic: 'الفجر', color: 'text-blue-700 bg-blue-50' },
  { key: 'sunrise', name: 'Sunrise', arabic: 'الشروق', color: 'text-orange-600 bg-orange-50' },
  { key: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر', color: 'text-yellow-600 bg-yellow-50' },
  { key: 'asr', name: 'Asr', arabic: 'العصر', color: 'text-amber-700 bg-amber-50' },
  { key: 'maghrib', name: 'Maghrib', arabic: 'المغرب', color: 'text-orange-700 bg-orange-100' },
  { key: 'isha', name: 'Isha', arabic: 'العشاء', color: 'text-indigo-700 bg-indigo-50' },
];

export default function PrayersPage() {
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch('/api/prayer/today?lat=23.8103&lng=90.4125&tz=Asia/Dhaka&method=Karachi&asr=Hanafi');
        const data = await response.json();
        setPrayerData(data);
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Prayer Times</h1>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Prayer Times</h1>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Location Info */}
      <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
        <div className="flex items-center text-green-800 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="font-medium">Dhaka, Bangladesh</span>
        </div>
        <div className="text-sm text-green-600">
          Method: {prayerData?.method} • Asr: {prayerData?.asr}
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="space-y-3">
        {prayerNames.map((prayer) => {
          const time = prayerData?.times[prayer.key as keyof typeof prayerData.times];
          const isNext = prayerData?.nextPrayer.name.toLowerCase() === prayer.name.toLowerCase();
          
          return (
            <div 
              key={prayer.key}
              className={`rounded-lg p-4 shadow-sm border transition-all ${
                isNext 
                  ? 'bg-green-50 border-green-200 ring-2 ring-green-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${prayer.color}`}>
                    <span className="text-lg">🕌</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center">
                      {prayer.name}
                      {isNext && (
                        <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                          Next
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{prayer.arabic}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold">
                    {time ? formatTime(new Date(time)) : '--:--'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Date */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>
    </div>
  );
}