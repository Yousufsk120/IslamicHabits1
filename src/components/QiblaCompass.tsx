import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

interface QiblaCompassProps {
  lat?: number;
  lng?: number;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  lat = 40.7128, // Default to New York
  lng = -74.006,
}) => {
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [location, setLocation] = useState<string>("New York, NY");

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    // Calculate Qibla direction using the great circle method
    const calculateQiblaDirection = (lat: number, lng: number): number => {
      const lat1 = (lat * Math.PI) / 180;
      const lat2 = (KAABA_LAT * Math.PI) / 180;
      const deltaLng = ((KAABA_LNG - lng) * Math.PI) / 180;

      const x = Math.sin(deltaLng) * Math.cos(lat2);
      const y =
        Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

      let qibla = Math.atan2(x, y);
      qibla = (qibla * 180) / Math.PI;
      qibla = (qibla + 360) % 360; // Normalize to 0-360

      return qibla;
    };

    const direction = calculateQiblaDirection(lat, lng);
    setQiblaDirection(direction);

    // Set location name (simplified)
    if (lat !== 40.7128 || lng !== -74.006) {
      setLocation(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
    }
  }, [lat, lng]);

  const formatDirection = (degrees: number): string => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getDistanceToMecca = (): number => {
    // Haversine formula to calculate distance
    const R = 6371; // Earth's radius in kilometers
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const deltaLat = ((KAABA_LAT - lat) * Math.PI) / 180;
    const deltaLng = ((KAABA_LNG - lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Navigation className="w-5 h-5 mr-2 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800">Qibla Direction</h3>
        </div>

        <p className="text-sm text-gray-600 flex items-center justify-center mb-6">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </p>

        {/* Compass */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100"></div>

          {/* Compass markings */}
          <div className="absolute inset-2 rounded-full">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-4 bg-gray-400"
                style={{
                  top: "4px",
                  left: "50%",
                  transformOrigin: "50% 92px",
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                }}
              />
            ))}

            {/* Cardinal directions */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
              N
            </div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
              S
            </div>
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-700">
              E
            </div>
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-700">
              W
            </div>
          </div>

          {/* Qibla arrow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${qiblaDirection}deg)` }}
            animate={{ rotate: qiblaDirection }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-1 h-16 bg-gradient-to-t from-green-600 to-green-400 rounded-full shadow-md"></div>
              <div className="w-3 h-3 bg-green-600 rounded-full border-2 border-white shadow-md"></div>
              <div className="w-0.5 h-16 bg-gradient-to-b from-green-400 to-green-200 rounded-full"></div>
            </div>
          </motion.div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-gray-600">Direction:</span>
            <span className="font-bold text-green-700">
              {qiblaDirection.toFixed(1)}° ({formatDirection(qiblaDirection)})
            </span>
          </div>

          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-gray-600">Distance to Mecca:</span>
            <span className="font-bold text-green-700">{getDistanceToMecca().toFixed(0)} km</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          🕋 Point your device towards the green arrow for Qibla
        </div>
      </div>
    </motion.div>
  );
};
