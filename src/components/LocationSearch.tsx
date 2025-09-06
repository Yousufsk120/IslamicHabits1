import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X } from 'lucide-react';
import { LocationData } from '../hooks/useGeolocation';

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void;
  onClose: () => void;
}

// Popular cities with their coordinates
const POPULAR_CITIES: LocationData[] = [
  { latitude: 21.4225, longitude: 39.8262, city: 'Mecca', country: 'Saudi Arabia' },
  { latitude: 24.4539, longitude: 39.6095, city: 'Medina', country: 'Saudi Arabia' },
  { latitude: 24.7136, longitude: 46.6753, city: 'Riyadh', country: 'Saudi Arabia' },
  { latitude: 25.2048, longitude: 55.2708, city: 'Dubai', country: 'United Arab Emirates' },
  { latitude: 30.0444, longitude: 31.2357, city: 'Cairo', country: 'Egypt' },
  { latitude: 33.6844, longitude: 73.0479, city: 'Islamabad', country: 'Pakistan' },
  { latitude: 24.8607, longitude: 67.0011, city: 'Karachi', country: 'Pakistan' },
  { latitude: 33.3152, longitude: 44.3661, city: 'Baghdad', country: 'Iraq' },
  { latitude: 35.6892, longitude: 51.3890, city: 'Tehran', country: 'Iran' },
  { latitude: 33.5138, longitude: 36.2765, city: 'Damascus', country: 'Syria' },
  { latitude: 39.9334, longitude: 32.8597, city: 'Ankara', country: 'Turkey' },
  { latitude: 31.7917, longitude: 35.2044, city: 'Jerusalem', country: 'Palestine' },
  { latitude: 6.5244, longitude: 3.3792, city: 'Lagos', country: 'Nigeria' },
  { latitude: -6.2088, longitude: 106.8456, city: 'Jakarta', country: 'Indonesia' },
  { latitude: 3.1390, longitude: 101.6869, city: 'Kuala Lumpur', country: 'Malaysia' },
  { latitude: 40.7128, longitude: -74.0060, city: 'New York', country: 'United States' },
  { latitude: 51.5074, longitude: -0.1278, city: 'London', country: 'United Kingdom' },
  { latitude: 48.8566, longitude: 2.3522, city: 'Paris', country: 'France' },
];

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(POPULAR_CITIES);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredCities(POPULAR_CITIES);
      return;
    }

    const filtered = POPULAR_CITIES.filter(
      city =>
        city.city?.toLowerCase().includes(term.toLowerCase()) ||
        city.country?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleCitySelect = (city: LocationData) => {
    onLocationSelect(city);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            Select Location
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Cities List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredCities.length > 0 ? (
              <div className="space-y-2">
                {filteredCities.map((city, index) => (
                  <motion.button
                    key={`${city.city}-${city.country}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="font-medium text-gray-800">{city.city}</div>
                    <div className="text-sm text-gray-500">{city.country}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-8"
              >
                <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No cities found</p>
                <p className="text-sm">Try searching for a different city</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Can't find your city? We're working on adding more locations!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};