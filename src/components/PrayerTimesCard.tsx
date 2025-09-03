import React, { useEffect, useState } from "react";
import { PrayerTimes, CalculationMethod, Coordinates } from "adhan";
import { motion } from "framer-motion";
import { Clock, MapPin, Loader } from "lucide-react";

interface PrayerTimesCardProps {
  lat?: number;
  lng?: number;
}

export const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({ 
  lat = 40.7128, // Default to New York
  lng = -74.0060 
}) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>("New York, NY");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const params = CalculationMethod.MuslimWorldLeague();
      const coordinates = new Coordinates(lat, lng);
      const times = new PrayerTimes(coordinates, new Date(), params);
      setPrayerTimes(times);
      setLoading(false);

      // Try to get location name from coordinates (simplified)
      if (lat !== 40.7128 || lng !== -74.0060) {
        setLocation(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
      }
    } catch (error) {
      console.error("Error calculating prayer times:", error);
      setLoading(false);
    }
  }, [lat, lng]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    
    const now = new Date();
    if (now < prayerTimes.fajr) return { name: "Fajr", time: prayerTimes.fajr };
    if (now < prayerTimes.sunrise) return { name: "Sunrise", time: prayerTimes.sunrise };
    if (now < prayerTimes.dhuhr) return { name: "Dhuhr", time: prayerTimes.dhuhr };
    if (now < prayerTimes.asr) return { name: "Asr", time: prayerTimes.asr };
    if (now < prayerTimes.maghrib) return { name: "Maghrib", time: prayerTimes.maghrib };
    if (now < prayerTimes.isha) return { name: "Isha", time: prayerTimes.isha };
    
    // After Isha, next is Fajr tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = new PrayerTimes(new Coordinates(lat, lng), tomorrow, CalculationMethod.MuslimWorldLeague());
    return { name: "Fajr", time: tomorrowTimes.fajr };
  };

  const currentPrayer = getCurrentPrayer();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-green-600 mr-2" />
          <span className="text-gray-600">Loading prayer times...</span>
        </div>
      </motion.div>
    );
  }

  if (!prayerTimes) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="text-center text-gray-600">
          Unable to load prayer times. Please check your location.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Prayer Times
          </h3>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </p>
        </div>
        {currentPrayer && (
          <div className="text-right">
            <div className="text-sm text-gray-600">Next Prayer</div>
            <div className="font-bold text-green-700">{currentPrayer.name}</div>
            <div className="text-sm text-gray-800">{formatTime(currentPrayer.time)}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-sm text-blue-700 font-medium">Fajr</div>
          <div className="text-lg font-bold text-blue-800">{formatTime(prayerTimes.fajr)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
          <div className="text-sm text-yellow-700 font-medium">Sunrise</div>
          <div className="text-lg font-bold text-yellow-800">{formatTime(prayerTimes.sunrise)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-sm text-green-700 font-medium">Dhuhr</div>
          <div className="text-lg font-bold text-green-800">{formatTime(prayerTimes.dhuhr)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="text-sm text-orange-700 font-medium">Asr</div>
          <div className="text-lg font-bold text-orange-800">{formatTime(prayerTimes.asr)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
          <div className="text-sm text-red-700 font-medium">Maghrib</div>
          <div className="text-lg font-bold text-red-800">{formatTime(prayerTimes.maghrib)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-sm text-purple-700 font-medium">Isha</div>
          <div className="text-lg font-bold text-purple-800">{formatTime(prayerTimes.isha)}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Using Muslim World League calculation method
      </div>
    </motion.div>
  );
};