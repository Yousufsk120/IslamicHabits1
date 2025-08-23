export interface PrayerTimesConfig {
  latitude: number;
  longitude: number;
  timezone: string;
  calculationMethod: string;
  madhhabAsr: 'Hanafi' | 'Shafi';
  highLatitudeRule: string;
}

export interface DailyPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface NextPrayerInfo {
  name: string;
  time: Date;
  remaining: string;
}

export function calculatePrayerTimes(
  config: PrayerTimesConfig,
  date: Date = new Date()
): DailyPrayerTimes {
  try {
    // For now, use simplified calculation with fallback times
    // In a real implementation, properly configure adhan-js
    const now = new Date(date);
    now.setHours(0, 0, 0, 0);
    
    return {
      fajr: new Date(now.getTime() + 5.5 * 60 * 60 * 1000), // 5:30 AM
      sunrise: new Date(now.getTime() + 6.75 * 60 * 60 * 1000), // 6:45 AM
      dhuhr: new Date(now.getTime() + 12.5 * 60 * 60 * 1000), // 12:30 PM
      asr: new Date(now.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM
      maghrib: new Date(now.getTime() + 18.5 * 60 * 60 * 1000), // 6:30 PM
      isha: new Date(now.getTime() + 20 * 60 * 60 * 1000), // 8:00 PM
    };
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    // Return fallback times (approximate for demo)
    const now = new Date(date);
    now.setHours(0, 0, 0, 0);
    
    return {
      fajr: new Date(now.getTime() + 5.5 * 60 * 60 * 1000),
      sunrise: new Date(now.getTime() + 6.75 * 60 * 60 * 1000),
      dhuhr: new Date(now.getTime() + 12.5 * 60 * 60 * 1000),
      asr: new Date(now.getTime() + 16 * 60 * 60 * 1000),
      maghrib: new Date(now.getTime() + 18.5 * 60 * 60 * 1000),
      isha: new Date(now.getTime() + 20 * 60 * 60 * 1000),
    };
  }
}

export function getNextPrayer(prayerTimes: DailyPrayerTimes): NextPrayerInfo {
  const now = new Date();
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];
  
  // Find next prayer today
  for (const prayer of prayers) {
    if (prayer.time > now) {
      return {
        name: prayer.name,
        time: prayer.time,
        remaining: getTimeUntil(prayer.time),
      };
    }
  }
  
  // If no prayers left today, return Fajr for tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowPrayers = calculatePrayerTimes({
    latitude: 23.8103, // Default Dhaka coordinates
    longitude: 90.4125,
    timezone: 'Asia/Dhaka',
    calculationMethod: 'Karachi',
    madhhabAsr: 'Hanafi',
    highLatitudeRule: 'AngleBased',
  }, tomorrow);
  
  return {
    name: 'Fajr',
    time: tomorrowPrayers.fajr,
    remaining: getTimeUntil(tomorrowPrayers.fajr),
  };
}

function getTimeUntil(targetTime: Date): string {
  const now = new Date();
  const diff = targetTime.getTime() - now.getTime();
  
  if (diff <= 0) return "00:00:00";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getPrayerTimeColor(prayerName: string): string {
  switch (prayerName.toLowerCase()) {
    case 'fajr':
      return 'fajr-color';
    case 'sunrise':
      return 'sunrise-color';  
    case 'dhuhr':
      return 'dhuhr-color';
    case 'asr':
      return 'asr-color';
    case 'maghrib':
      return 'maghrib-color';
    case 'isha':
      return 'isha-color';
    default:
      return 'text-gray-600';
  }
}