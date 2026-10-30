import { useState, useCallback } from 'react';

/**
 * Fallback to IP-based geolocation if browser GPS permission is denied or unavailable.
 * Completely free, zero-config, zero-API-key needed.
 */
const getLocationByIp = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          lat: Number(data.latitude),
          lon: Number(data.longitude),
          city: data.city || '',
          country: data.country_name || ''
        };
      }
    }
  } catch {
    // secondary free fallback
  }

  try {
    const res2 = await fetch('https://ipwho.is/');
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2.success && data2.latitude && data2.longitude) {
        return {
          lat: Number(data2.latitude),
          lon: Number(data2.longitude),
          city: data2.city || '',
          country: data2.country || ''
        };
      }
    }
  } catch {
    // fallback
  }

  return null;
};

/**
 * Custom hook for Geolocation with intelligent IP fallback
 */
export const useGeolocation = () => {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      setIsLocating(true);
      setGeoError(null);

      const tryIpFallback = async (originalErrorMsg) => {
        try {
          const ipLoc = await getLocationByIp();
          if (ipLoc) {
            setIsLocating(false);
            setGeoError(null);
            resolve({
              lat: ipLoc.lat,
              lon: ipLoc.lon,
              cityName: ipLoc.city,
              isIpFallback: true
            });
            return;
          }
        } catch {
          // both failed
        }
        setIsLocating(false);
        setGeoError(originalErrorMsg);
        reject(new Error(originalErrorMsg));
      };

      if (!navigator.geolocation) {
        tryIpFallback('Geolocation is not supported by your browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setGeoError(null);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            isIpFallback: false
          });
        },
        (error) => {
          let message = 'Location access was denied. Please allow location permissions in your browser URL bar.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access was denied in browser. Checking your approximate location via network...';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable. Detecting via network...';
              break;
            case error.TIMEOUT:
              message = 'GPS request timed out. Detecting via network...';
              break;
            default:
              break;
          }

          // Try automatic IP fallback so user doesn't get blocked!
          tryIpFallback(message);
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  return { getCurrentLocation, isLocating, geoError, setGeoError };
};

export default useGeolocation;
