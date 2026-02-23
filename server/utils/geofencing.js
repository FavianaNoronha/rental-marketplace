/**
 * Geofencing and Hyperlocal Delivery Utilities
 * For implementing 15km radius filtering and 90-minute express delivery
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Number} lat1 - Latitude of point 1
 * @param {Number} lon1 - Longitude of point 1
 * @param {Number} lat2 - Latitude of point 2
 * @param {Number} lon2 - Longitude of point 2
 * @returns {Number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if coordinates are within geofence radius
 * @param {Object} centerCoords - Center point {lat, lng}
 * @param {Object} targetCoords - Target point {lat, lng}
 * @param {Number} radiusKm - Radius in kilometers (default: 15)
 * @returns {Boolean} True if within radius
 */
const isWithinGeofence = (centerCoords, targetCoords, radiusKm = 15) => {
  if (!centerCoords || !targetCoords) return false;
  if (!centerCoords.lat || !centerCoords.lng || !targetCoords.lat || !targetCoords.lng) return false;
  
  const distance = calculateDistance(
    centerCoords.lat,
    centerCoords.lng,
    targetCoords.lat,
    targetCoords.lng
  );
  
  return distance <= radiusKm;
};

/**
 * Filter products by geofence
 * @param {Array} products - Array of products with location data
 * @param {Object} userLocation - User's coordinates {lat, lng}
 * @param {Number} radiusKm - Radius in kilometers (default: 15)
 * @returns {Array} Filtered products within radius
 */
const filterProductsByGeofence = (products, userLocation, radiusKm = 15) => {
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    return products;
  }
  
  return products
    .map(product => {
      // Extract coordinates from product location
      const productCoords = {
        lat: product.location?.coordinates?.coordinates?.[1],
        lng: product.location?.coordinates?.coordinates?.[0]
      };
      
      if (!productCoords.lat || !productCoords.lng) {
        return null;
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
    .filter(product => product !== null && product.isHyperlocal)
    .sort((a, b) => a.distance - b.distance); // Sort by nearest first
};

/**
 * Hyderabad premium cluster coordinates
 * For targeting specific neighborhoods
 */
const hyderabadClusters = {
  jubilee_hills: { lat: 17.4239, lng: 78.4089, name: 'Jubilee Hills' },
  banjara_hills: { lat: 17.4183, lng: 78.4479, name: 'Banjara Hills' },
  gachibowli: { lat: 17.4400, lng: 78.3489, name: 'Gachibowli' },
  kondapur: { lat: 17.4649, lng: 78.3696, name: 'Kondapur' },
  hitech_city: { lat: 17.4484, lng: 78.3805, name: 'Hitech City' },
  madhapur: { lat: 17.4485, lng: 78.3908, name: 'Madhapur' }
};

/**
 * Find nearest premium cluster
 * @param {Object} coordinates - User coordinates {lat, lng}
 * @returns {Object} Nearest cluster info
 */
const findNearestCluster = (coordinates) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) return null;
  
  let nearest = null;
  let minDistance = Infinity;
  
  Object.entries(hyderabadClusters).forEach(([key, cluster]) => {
    const distance = calculateDistance(
      coordinates.lat,
      coordinates.lng,
      cluster.lat,
      cluster.lng
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...cluster, distance };
    }
  });
  
  return nearest;
};

/**
 * Check if user is in Hyderabad premium zones
 * @param {Object} coordinates - User coordinates {lat, lng}
 * @returns {Boolean} True if in premium zone
 */
const isInHyderabadPremiumZone = (coordinates) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) return false;
  
  const nearest = findNearestCluster(coordinates);
  return nearest && nearest.distance <= 5; // Within 5km of any premium cluster
};

/**
 * Estimate delivery time based on distance and service type
 * @param {Number} distanceKm - Distance in kilometers
 * @param {String} serviceType - 'express' | 'standard' | 'scheduled'
 * @param {String} provider - 'borzo' | 'dunzo' | 'porter' | 'self'
 * @returns {Object} Estimated delivery time
 */
const estimateDeliveryTime = (distanceKm, serviceType = 'standard', provider = 'self') => {
  let baseMinutes = 0;
  let maxMinutes = 0;
  
  if (serviceType === 'express' && distanceKm <= 15) {
    // Hyperlocal express: 90-minute delivery
    baseMinutes = 60;
    maxMinutes = 90;
  } else if (provider === 'borzo' || provider === 'dunzo') {
    // Professional delivery services
    baseMinutes = distanceKm <= 5 ? 30 : distanceKm <= 10 ? 60 : 90;
    maxMinutes = baseMinutes + 30;
  } else {
    // Standard delivery
    baseMinutes = distanceKm * 10; // 10 min per km estimate
    maxMinutes = baseMinutes + 60;
  }
  
  const now = new Date();
  const estimatedMin = new Date(now.getTime() + baseMinutes * 60000);
  const estimatedMax = new Date(now.getTime() + maxMinutes * 60000);
  
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    estimatedMinutes: {
      min: baseMinutes,
      max: maxMinutes
    },
    estimatedTime: {
      min: estimatedMin,
      max: estimatedMax
    },
    serviceType,
    isExpressEligible: distanceKm <= 15
  };
};

/**
 * Calculate delivery cost based on distance and service
 * @param {Number} distanceKm - Distance in kilometers
 * @param {String} serviceType - 'express' | 'standard'
 * @param {String} provider - 'borzo' | 'dunzo' | 'porter' | 'self'
 * @returns {Object} Delivery cost breakdown
 */
const calculateDeliveryCost = (distanceKm, serviceType = 'standard', provider = 'self') => {
  let baseCost = 0;
  let perKmCost = 0;
  let surcharge = 0;
  
  if (provider === 'borzo' || provider === 'dunzo') {
    baseCost = 50; // ₹50 base
    perKmCost = distanceKm <= 5 ? 10 : 12;
    
    if (serviceType === 'express') {
      surcharge = 30; // Express surcharge
    }
  } else if (provider === 'porter') {
    baseCost = 40;
    perKmCost = 8;
  } else {
    // Self/platform delivery
    baseCost = 30;
    perKmCost = 5;
  }
  
  const distanceCost = distanceKm * perKmCost;
  const total = baseCost + distanceCost + surcharge;
  
  return {
    base: baseCost,
    distance: Math.round(distanceCost),
    surcharge,
    total: Math.round(total),
    distanceKm: Math.round(distanceKm * 10) / 10,
    provider,
    serviceType
  };
};

/**
 * Get hyperlocal availability for a product
 * @param {Object} product - Product with location
 * @param {Object} userLocation - User coordinates {lat, lng}
 * @returns {Object} Hyperlocal availability info
 */
const getHyperlocalAvailability = (product, userLocation) => {
  if (!product.location?.coordinates?.coordinates || !userLocation) {
    return {
      available: false,
      reason: 'Location data not available'
    };
  }
  
  const productCoords = {
    lat: product.location.coordinates.coordinates[1],
    lng: product.location.coordinates.coordinates[0]
  };
  
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    productCoords.lat,
    productCoords.lng
  );
  
  const deliveryTime = estimateDeliveryTime(distance, 'express', 'dunzo');
  const deliveryCost = calculateDeliveryCost(distance, 'express', 'dunzo');
  
  return {
    available: distance <= 15,
    distance: Math.round(distance * 10) / 10,
    deliveryTime,
    deliveryCost,
    expressEligible: distance <= 15,
    productCity: product.location.city,
    isHyperlocal: distance <= 15
  };
};

/**
 * MongoDB geospatial query helper
 * @param {Object} coordinates - Center point {lat, lng}
 * @param {Number} radiusKm - Radius in kilometers
 * @returns {Object} MongoDB query object
 */
const createGeospatialQuery = (coordinates, radiusKm = 15) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    return {};
  }
  
  // Convert km to meters for MongoDB
  const radiusMeters = radiusKm * 1000;
  
  return {
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        },
        $maxDistance: radiusMeters
      }
    }
  };
};

module.exports = {
  calculateDistance,
  isWithinGeofence,
  filterProductsByGeofence,
  hyderabadClusters,
  findNearestCluster,
  isInHyderabadPremiumZone,
  estimateDeliveryTime,
  calculateDeliveryCost,
  getHyperlocalAvailability,
  createGeospatialQuery
};
