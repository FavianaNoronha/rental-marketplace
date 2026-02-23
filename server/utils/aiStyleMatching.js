/**
 * AI Style Twins Matching Utility
 * Finds users with similar body types and skin tones to show "how it looks on someone like you"
 */

/**
 * Calculate similarity score between two user style profiles
 * @param {Object} user1Profile - First user's style profile
 * @param {Object} user2Profile - Second user's style profile
 * @returns {Number} Similarity score (0-100)
 */
const calculateStyleTwinScore = (user1Profile, user2Profile) => {
  if (!user1Profile || !user2Profile) return 0;

  let score = 0;
  let factors = 0;

  // Body measurements similarity (40% weight)
  if (user1Profile.measurements && user2Profile.measurements) {
    const heightDiff = Math.abs((user1Profile.measurements.height || 0) - (user2Profile.measurements.height || 0));
    const weightDiff = Math.abs((user1Profile.measurements.weight || 0) - (user2Profile.measurements.weight || 0));
    
    // Height: Close match if within 5cm
    if (heightDiff <= 5) score += 15;
    else if (heightDiff <= 10) score += 10;
    else if (heightDiff <= 15) score += 5;
    factors++;

    // Weight: Close match if within 5kg
    if (weightDiff <= 5) score += 15;
    else if (weightDiff <= 10) score += 10;
    else if (weightDiff <= 15) score += 5;
    factors++;

    // Size match (10% weight)
    if (user1Profile.measurements.topSize === user2Profile.measurements.topSize) {
      score += 5;
    }
    if (user1Profile.measurements.bottomSize === user2Profile.measurements.bottomSize) {
      score += 5;
    }
    factors++;
  }

  // Body type similarity (20% weight)
  if (user1Profile.bodyType && user2Profile.bodyType) {
    if (user1Profile.bodyType === user2Profile.bodyType) {
      score += 20;
    } else {
      // Partial match for similar body types
      const similarTypes = {
        'petite': ['slim'],
        'slim': ['petite', 'athletic'],
        'athletic': ['slim'],
        'curvy': ['plus_size'],
        'plus_size': ['curvy']
      };
      
      if (similarTypes[user1Profile.bodyType]?.includes(user2Profile.bodyType)) {
        score += 10;
      }
    }
    factors++;
  }

  // Skin tone similarity (15% weight)
  if (user1Profile.skinTone && user2Profile.skinTone) {
    if (user1Profile.skinTone === user2Profile.skinTone) {
      score += 15;
    } else {
      // Adjacent tones get partial score
      const toneScale = ['fair', 'light', 'medium', 'olive', 'tan', 'brown', 'dark'];
      const tone1Index = toneScale.indexOf(user1Profile.skinTone);
      const tone2Index = toneScale.indexOf(user2Profile.skinTone);
      
      if (Math.abs(tone1Index - tone2Index) === 1) {
        score += 10;
      } else if (Math.abs(tone1Index - tone2Index) === 2) {
        score += 5;
      }
    }
    factors++;
  }

  // Style preferences similarity (15% weight)
  if (user1Profile.stylePreferences && user2Profile.stylePreferences) {
    // Preferred colors overlap
    const colors1 = user1Profile.stylePreferences.preferredColors || [];
    const colors2 = user2Profile.stylePreferences.preferredColors || [];
    const colorOverlap = colors1.filter(c => colors2.includes(c)).length;
    
    if (colorOverlap > 0) {
      score += Math.min(10, colorOverlap * 2);
    }

    // Occasion preferences overlap
    const occasions1 = user1Profile.stylePreferences.occasions || [];
    const occasions2 = user2Profile.stylePreferences.occasions || [];
    const occasionOverlap = occasions1.filter(o => occasions2.includes(o)).length;
    
    if (occasionOverlap > 0) {
      score += Math.min(5, occasionOverlap);
    }
    
    factors++;
  }

  // Normalize score to 0-100
  return Math.min(100, Math.round(score));
};

/**
 * Find style twins for a user
 * @param {Object} userProfile - User's style profile
 * @param {Array} candidateProfiles - Array of potential style twin profiles
 * @param {Number} minScore - Minimum similarity score (default: 70)
 * @param {Number} limit - Maximum number of twins to return (default: 10)
 * @returns {Array} Array of style twins with scores
 */
const findStyleTwins = (userProfile, candidateProfiles, minScore = 70, limit = 10) => {
  const twins = candidateProfiles
    .map(candidate => ({
      userId: candidate.userId,
      profile: candidate,
      score: calculateStyleTwinScore(userProfile, candidate)
    }))
    .filter(twin => twin.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return twins;
};

/**
 * Generate AI product recommendations based on style profile
 * @param {Object} userProfile - User's style profile
 * @param {Array} products - Array of products to filter
 * @returns {Array} Recommended products
 */
const generateStyleRecommendations = (userProfile, products) => {
  if (!userProfile || !products || products.length === 0) return [];

  return products
    .map(product => {
      let score = 0;

      // Match preferred colors
      if (userProfile.stylePreferences?.preferredColors?.length > 0 && product.specifications?.color) {
        if (userProfile.stylePreferences.preferredColors.some(c => 
          product.specifications.color.toLowerCase().includes(c.toLowerCase())
        )) {
          score += 30;
        }
      }

      // Avoid colors the user dislikes
      if (userProfile.stylePreferences?.avoidColors?.length > 0 && product.specifications?.color) {
        if (userProfile.stylePreferences.avoidColors.some(c => 
          product.specifications.color.toLowerCase().includes(c.toLowerCase())
        )) {
          score -= 50; // Heavy penalty
        }
      }

      // Match brand preferences
      if (userProfile.stylePreferences?.brands?.length > 0 && product.specifications?.brand) {
        if (userProfile.stylePreferences.brands.some(b => 
          product.specifications.brand.toLowerCase().includes(b.toLowerCase())
        )) {
          score += 20;
        }
      }

      // Match size
      if (userProfile.measurements?.topSize && product.specifications?.size) {
        if (product.specifications.size === userProfile.measurements.topSize) {
          score += 25;
        }
      }

      // Match price range
      if (userProfile.stylePreferences?.priceRange) {
        const productPrice = product.price?.rent?.perDay || product.price?.sale || 0;
        const { min, max } = userProfile.stylePreferences.priceRange;
        
        if (productPrice >= min && productPrice <= max) {
          score += 15;
        }
      }

      return {
        ...product,
        recommendationScore: score
      };
    })
    .filter(product => product.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
};

/**
 * Calculate environmental impact of renting vs buying
 * @param {Number} itemPrice - Original price of item
 * @param {Number} rentalDays - Number of days rented
 * @returns {Object} Environmental impact stats
 */
const calculateEnvironmentalImpact = (itemPrice, rentalDays) => {
  // Average water consumption for clothing production
  const avgWaterPerGarment = 2700; // liters
  const avgCarbonPerGarment = 6.5; // kg CO2
  
  // Estimate based on rental preventing a purchase
  const purchasePrevention = 0.3; // 30% chance this rental prevented a purchase
  
  return {
    waterSaved: Math.round(avgWaterPerGarment * purchasePrevention),
    carbonReduced: Math.round(avgCarbonPerGarment * purchasePrevention * 10) / 10,
    rentalDays,
    sustainabilityScore: Math.min(100, rentalDays * 5) // Higher for longer rentals
  };
};

/**
 * Generate size recommendation based on similar users
 * @param {Object} userProfile - User's style profile
 * @param {Object} product - Product to recommend size for
 * @param {Array} similarUserPurchases - Purchases by similar users
 * @returns {Object} Size recommendation
 */
const recommendSize = (userProfile, product, similarUserPurchases = []) => {
  if (!userProfile.measurements) {
    return { recommended: null, confidence: 0 };
  }

  // Find purchases of same product by style twins
  const samePurchases = similarUserPurchases.filter(p => 
    p.productId.toString() === product._id.toString()
  );

  if (samePurchases.length > 0) {
    // Return most common size purchased by twins
    const sizeCounts = {};
    samePurchases.forEach(p => {
      sizeCounts[p.size] = (sizeCounts[p.size] || 0) + 1;
    });
    
    const recommendedSize = Object.entries(sizeCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      recommended: recommendedSize,
      confidence: Math.min(100, (samePurchases.length / 5) * 100),
      basedOn: `${samePurchases.length} similar users`
    };
  }

  // Fallback to user's standard size
  const userSize = product.category === 'Clothes' 
    ? userProfile.measurements.topSize 
    : userProfile.measurements.bottomSize;

  return {
    recommended: userSize,
    confidence: 50,
    basedOn: 'your profile'
  };
};

module.exports = {
  calculateStyleTwinScore,
  findStyleTwins,
  generateStyleRecommendations,
  calculateEnvironmentalImpact,
  recommendSize
};
