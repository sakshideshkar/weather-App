import { useState, useCallback } from 'react';

/**
 * Custom hook for Browser Geolocation API
 */
export const useGeolocation = () => {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = 'Geolocation is not supported by your browser.';
        setGeoError(msg);
        reject(new Error(msg));
        return;
      }

      setIsLocating(true);
      setGeoError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          setIsLocating(false);
          let message = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access was denied. Please allow location permissions in your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable. Please try searching manually.';
              break;
            case error.TIMEOUT:
              message = 'The request to get your location timed out. Please try again.';
              break;
            default:
              message = 'An unknown error occurred while requesting your location.';
              break;
          }
          setGeoError(message);
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  return { getCurrentLocation, isLocating, geoError, setGeoError };
};

export default useGeolocation;
