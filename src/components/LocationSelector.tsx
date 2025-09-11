import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Loader, AlertCircle } from "lucide-react";

interface LocationSelectorProps {
  onLocationChange: (lat: number, lng: number, locationName?: string) => void;
  currentLat: number;
  currentLng: number;
  currentLocation: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationChange,
  currentLat,
  currentLng,
  currentLocation,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [manualLat, setManualLat] = useState(currentLat.toString());
  const [manualLng, setManualLng] = useState(currentLng.toString());
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Popular cities for quick selection
  const popularCities = [
    { name: "Mecca, Saudi Arabia", lat: 21.4225, lng: 39.8262 },
    { name: "Medina, Saudi Arabia", lat: 24.4686, lng: 39.6142 },
    { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 },
    { name: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
    { name: "London, UK", lat: 51.5074, lng: -0.1278 },
    { name: "New York, USA", lat: 40.7128, lng: -74.006 },
    { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
    { name: "Karachi, Pakistan", lat: 24.8607, lng: 67.0011 },
    { name: "Jakarta, Indonesia", lat: -6.2088, lng: 106.8456 },
    { name: "Kuala Lumpur, Malaysia", lat: 3.139, lng: 101.6869 },
    { name: "Tehran, Iran", lat: 35.6892, lng: 51.389 },
    { name: "Delhi, India", lat: 28.7041, lng: 77.1025 },
    { name: "Dhaka, Bangladesh", lat: 23.8103, lng: 90.4125 },
  ];

  useEffect(() => {
    setManualLat(currentLat.toString());
    setManualLng(currentLng.toString());
  }, [currentLat, currentLng]);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationChange(latitude, longitude, "Your Current Location");
        setIsLoadingLocation(false);
        setIsExpanded(false);
      },
      (error) => {
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationError(
        "Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)",
      );
      return;
    }

    setLocationError(null);
    onLocationChange(lat, lng, `${lat.toFixed(2)}, ${lng.toFixed(2)}`);
    setIsExpanded(false);
  };

  const handleCitySelect = (city: (typeof popularCities)[0]) => {
    onLocationChange(city.lat, city.lng, city.name);
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <MapPin className="w-4 h-4" />
        <span className="truncate max-w-32">{currentLocation}</span>
        <span className="text-xs text-gray-500">▼</span>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
        >
          <h4 className="font-semibold text-gray-800 mb-4">Select Location</h4>

          {/* Geolocation Button */}
          <button
            onClick={handleGeolocation}
            disabled={isLoadingLocation}
            className="w-full mb-4 flex items-center justify-center space-x-2 bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoadingLocation ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{isLoadingLocation ? "Getting Location..." : "Use My Location"}</span>
          </button>

          {/* Error Message */}
          {locationError && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Popular Cities */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Popular Cities</h5>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {popularCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Coordinates */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Manual Coordinates</h5>
            <form onSubmit={handleManualSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Latitude"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  step="any"
                  min="-90"
                  max="90"
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  step="any"
                  min="-180"
                  max="180"
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded py-2 px-4 text-sm hover:bg-blue-700 transition-colors"
              >
                Set Location
              </button>
            </form>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
};
