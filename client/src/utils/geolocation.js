/**
 * Frontend Geolocation Utilities
 * For Hyderabad-first personalization and hyperlocal features
 */

// Hyderabad premium clusters
export const hyderabadClusters = {
  jubilee_hills: { lat: 17.4239, lng: 78.4089, name: 'Jubilee Hills' },
  banjara_hills: { lat: 17.4183, lng: 78.4479, name: 'Banjara Hills' },
  gachibowli: { lat: 17.4400, lng: 78.3489, name: 'Gachibowli' },
  kondapur: { lat: 17.4649, lng: 78.3696, name: 'Kondapur' },
  hitech_city: { lat: 17.4484, lng: 78.3805, name: 'Hitech City' },
  madhapur: { lat: 17.4485, lng: 78.3908, name: 'Madhapur' }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {Number} lat1 - Latitude of point 1
 * @param {Number} lng1 - Longitude of point 1
 * @param {Number} lat2 - Latitude of point 2
 * @param {Number} lng2 - Longitude of point 2
 * @returns {Number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const toRadians = (degrees) => degrees * (Math.PI / 180);

/**
 * Get user's current location using browser Geolocation API
 * @returns {Promise<Object>} User's coordinates {lat, lng}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Check if user is in Hyderabad
 * @param {Object} userLocation - {lat, lng}
 * @returns {Boolean}
 */
export const isInHyderabad = (userLocation) => {
  if (!userLocation || !userLocation.lat || !userLocation.lng) return false;

  // Hyderabad city center (rough bounds)
  const hyderabadCenter = { lat: 17.3850, lng: 78.4867 };
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    hyderabadCenter.lat,
    hyderabadCenter.lng
  );

  // Within 30km of city center = Hyderabad
  return distance <= 30;
};

/**
 * Find nearest premium cluster
 * @param {Object} userLocation - {lat, lng}
 * @returns {Object} Nearest cluster info
 */
export const findNearestCluster = (userLocation) => {
  if (!userLocation || !userLocation.lat || !userLocation.lng) return null;

  let nearest = null;
  let minDistance = Infinity;

  Object.entries(hyderabadClusters).forEach(([key, cluster]) => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      cluster.lat,
      cluster.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...cluster, distance, key };
    }
  });

  return nearest;
};

/**
 * Check if product is within hyperlocal radius (15km)
 * @param {Object} userLocation - {lat, lng}
 * @param {Object} productLocation - {lat, lng}
 * @returns {Boolean}
 */
export const isHyperlocal = (userLocation, productLocation) => {
  if (!userLocation || !productLocation) return false;

  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    productLocation.lat,
    productLocation.lng
  );

  return distance <= 15; // 15km radius
};

/**
 * Filter products by geofence
 * @param {Array} products - Array of products
 * @param {Object} userLocation - {lat, lng}
 * @param {Number} radiusKm - Radius in km (default: 15)
 * @returns {Array} Filtered products with distance
 */
export const filterProductsByLocation = (products, userLocation, radiusKm = 15) => {
  if (!userLocation || !products) return products;

  return products
    .map(product => {
      const productCoords = {
        lat: product.location?.coordinates?.coordinates?.[1],
        lng: product.location?.coordinates?.coordinates?.[0]
      };

      if (!productCoords.lat || !productCoords.lng) {
        return { ...product, distance: null, isHyperlocal: false };
      }

      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        productCoords.lat,
        productCoords.lng
      );

      return {
        ...product,
        distance,
        isHyperlocal: distance <= radiusKm
      };
    })
    .filter(product => product.distance === null || product.distance <= radiusKm)
    .sort((a, b) => (a.distance || 999) - (b.distance || 999));
};

/**
 * Get location from localStorage (cached)
 * @returns {Object|null} Cached location
 */
export const getCachedLocation = () => {
  try {
    const cached = localStorage.getItem('userLocation');
    if (!cached) return null;

    const location = JSON.parse(cached);
    const now = Date.now();

    // Cache expires after 1 hour
    if (location.timestamp && (now - location.timestamp) < 3600000) {
      return {
        lat: location.lat,
        lng: location.lng
      };
    }

    return null;
  } catch (error) {
    console.error('Error reading cached location:', error);
    return null;
  }
};

/**
 * Save location to localStorage
 * @param {Object} location - {lat, lng}
 */
export const cacheLocation = (location) => {
  try {
    localStorage.setItem('userLocation', JSON.stringify({
      ...location,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching location:', error);
  }
};

/**
 * Get location with fallback to cached value
 * @returns {Promise<Object>} Location object
 */
export const getUserLocation = async () => {
  try {
    // Try to get current location
    const location = await getCurrentLocation();
    cacheLocation(location);
    return location;
  } catch (error) {
    // Fallback to cached location
    const cached = getCachedLocation();
    if (cached) {
      return cached;
    }

    // Fallback to Hyderabad city center
    console.warn('Using default Hyderabad location:', error.message);
    return {
      lat: 17.3850,
      lng: 78.4867,
      isDefault: true
    };
  }
};

/**
 * Format distance for display
 * @param {Number} distanceKm - Distance in kilometers
 * @returns {String} Formatted distance
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined) return '';
  
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  }
  
  return `${distanceKm.toFixed(1)}km away`;
};

/**
 * Estimate delivery time based on distance
 * @param {Number} distanceKm - Distance in kilometers
 * @param {Boolean} isExpress - Express delivery
 * @returns {String} Estimated delivery time
 */
export const estimateDeliveryTime = (distanceKm, isExpress = false) => {
  if (!distanceKm) return 'Standard delivery';

  if (isExpress && distanceKm <= 15) {
    return '90-min Express Delivery';
  }

  if (distanceKm <= 5) {
    return 'Delivery in 1-2 hours';
  }

  if (distanceKm <= 10) {
    return 'Delivery in 2-3 hours';
  }

  if (distanceKm <= 15) {
    return 'Same day delivery';
  }

  return 'Standard delivery (1-2 days)';
};

/**
 * Check if location permission is granted
 * @returns {Promise<Boolean>}
 */
export const checkLocationPermission = async () => {
  if (!navigator.permissions) return false;

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state === 'granted';
  } catch (error) {
    return false;
  }
};

export default {
  hyderabadClusters,
  calculateDistance,
  getCurrentLocation,
  isInHyderabad,
  findNearestCluster,
  isHyperlocal,
  filterProductsByLocation,
  getCachedLocation,
  cacheLocation,
  getUserLocation,
  formatDistance,
  estimateDeliveryTime,
  checkLocationPermission
};
