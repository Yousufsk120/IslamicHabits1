import React, { useEffect, useState } from "react";
import { PrayerTimes, CalculationMethod, Coordinates } from "adhan";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Loader, Search } from "lucide-react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useLanguage } from "../contexts/LanguageContext";
import { LocationSearch } from "./LocationSearch";

interface PrayerTimesCardProps {
  lat?: number;
  lng?: number;
}

export const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({ 
  lat: propLat, 
  lng: propLng 
}) => {
  const { location: geoLocation, loading: geoLoading, requestLocation } = useGeolocation();
  const { translations, isRTL } = useLanguage();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [locationName, setLocationName] = useState<string>("Detecting location...");
  const [loading, setLoading] = useState(true);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  // Determine which coordinates to use
  const lat = propLat ?? geoLocation?.latitude ?? 40.7128; // Default to New York
  const lng = propLng ?? geoLocation?.longitude ?? -74.0060;

  useEffect(() => {
    if (geoLoading) {
      setLocationName(translations.detectingLocation);
      setLoading(true);
      return;
    }

    try {
      const params = CalculationMethod.MuslimWorldLeague();
      const coordinates = new Coordinates(lat, lng);
      const times = new PrayerTimes(coordinates, new Date(), params);
      setPrayerTimes(times);
      setLoading(false);

      // Set location name
      if (geoLocation?.city && geoLocation?.country) {
        setLocationName(`${geoLocation.city}, ${geoLocation.country}`);
      } else if (propLat && propLng) {
        setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
      } else {
        setLocationName("New York, NY");
      }
    } catch (error) {
      console.error("Error calculating prayer times:", error);
      setLoading(false);
    }
  }, [lat, lng, geoLocation, geoLoading, propLat, propLng]);

  const handleLocationSelect = (newLocation: any) => {
    // Update location coordinates and trigger prayer times recalculation
    const newCoordinates = new Coordinates(newLocation.latitude, newLocation.longitude);
    const newTimes = new PrayerTimes(newCoordinates, new Date(), CalculationMethod.MuslimWorldLeague());
    setPrayerTimes(newTimes);
    setLocationName(`${newLocation.city}, ${newLocation.country}`);
    
    // Save the new location to localStorage for persistence
    localStorage.setItem('ih_prayer_location', JSON.stringify(newLocation));
  };

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
          <h3 className={`text-xl font-bold text-gray-800 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className={`w-5 h-5 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {translations.prayerTimes}
          </h3>
          <p className={`text-sm text-gray-600 flex items-center mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span>{locationName}</span>
            <button
              onClick={() => setShowLocationSearch(true)}
              className={`p-1 text-gray-400 hover:text-green-600 transition-colors ${isRTL ? 'mr-2' : 'ml-2'}`}
              title={translations.changeLocation}
            >
              <Search className="w-4 h-4" />
            </button>
          </p>
        </div>
        {currentPrayer && (
          <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
            <div className="text-sm text-gray-600">{translations.nextPrayer}</div>
            <div className="font-bold text-green-700">{currentPrayer.name}</div>
            <div className="text-sm text-gray-800">{formatTime(currentPrayer.time)}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-sm text-blue-700 font-medium">{translations.fajr}</div>
          <div className="text-lg font-bold text-blue-800">{formatTime(prayerTimes.fajr)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
          <div className="text-sm text-yellow-700 font-medium">{translations.sunrise}</div>
          <div className="text-lg font-bold text-yellow-800">{formatTime(prayerTimes.sunrise)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-sm text-green-700 font-medium">{translations.dhuhr}</div>
          <div className="text-lg font-bold text-green-800">{formatTime(prayerTimes.dhuhr)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="text-sm text-orange-700 font-medium">{translations.asr}</div>
          <div className="text-lg font-bold text-orange-800">{formatTime(prayerTimes.asr)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
          <div className="text-sm text-red-700 font-medium">{translations.maghrib}</div>
          <div className="text-lg font-bold text-red-800">{formatTime(prayerTimes.maghrib)}</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-sm text-purple-700 font-medium">{translations.isha}</div>
          <div className="text-lg font-bold text-purple-800">{formatTime(prayerTimes.isha)}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {translations.calculationMethod}
      </div>

      {/* Location Search Modal */}
      <AnimatePresence>
        {showLocationSearch && (
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            onClose={() => setShowLocationSearch(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};