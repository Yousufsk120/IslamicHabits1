import { useState, useEffect } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
    hasPermission: false,
  });

  const requestLocation = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
        hasPermission: false,
      }));
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Try to get city/country info using reverse geocoding (simplified)
      try {
        await getCityFromCoordinates(locationData);
      } catch (geoError) {
        console.warn('Failed to get city information:', geoError);
        // Continue with just coordinates
      }

      setState({
        location: locationData,
        loading: false,
        error: null,
        hasPermission: true,
      });
    } catch (error) {
      let errorMessage = 'Failed to get location.';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
      }

      setState({
        location: null,
        loading: false,
        error: errorMessage,
        hasPermission: false,
      });
    }
  };

  const getCityFromCoordinates = async (location: LocationData) => {
    // Use a simple approach to get city name from coordinates
    // In a real app, you might use a proper geocoding service
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        location.city = data.city || data.locality || 'Unknown City';
        location.country = data.countryName || 'Unknown Country';
        location.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
    } catch (error) {
      console.warn('Geocoding failed:', error);
      // Set fallback values
      location.city = 'Unknown City';
      location.country = 'Unknown Country';
      location.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  };

  const setLocation = (locationData: LocationData) => {
    setState(prev => ({
      ...prev,
      location: locationData,
      loading: false,
      error: null,
      hasPermission: true,
    }));
  };

  useEffect(() => {
    // Check if we have cached location data
    const cachedLocation = localStorage.getItem('ih_location');
    if (cachedLocation) {
      try {
        const parsed = JSON.parse(cachedLocation);
        setState({
          location: parsed,
          loading: false,
          error: null,
          hasPermission: true,
        });
        return;
      } catch {
        localStorage.removeItem('ih_location');
      }
    }

    // Auto-request location on mount
    requestLocation();
  }, []);

  useEffect(() => {
    // Cache location data when it changes
    if (state.location) {
      localStorage.setItem('ih_location', JSON.stringify(state.location));
    }
  }, [state.location]);

  return {
    ...state,
    requestLocation,
    setLocation,
  };
}