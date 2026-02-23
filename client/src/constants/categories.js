/**
 * Professional Taxonomy Constants
 * Myntra/Swiggy-level category system for Closetly
 * 
 * Based on the 2026 WaaS (Wardrobe-as-a-Service) model
 */

export const PILLARS = {
  UTSAV: 'Utsav',           // Festive & Occasion (High margin anchor)
  SAFAR: 'Safar',           // Travel & Western (Frequency driver)
  ALANKRIT: 'Alankrit',     // Jewelry (Completers)
  NICHE_LUXE: 'Niche-Luxe', // Inclusive closet (Specialized gap)
  COMPLETERS: 'Completers'  // Footwear & accessories
};

export const CATEGORIES = {
  // Utsav (Festive)
  LEHENGA: 'Lehenga',
  ANARKALI: 'Anarkali',
  SHARARA: 'Sharara',
  STRUCTURED_DRAPE: 'Structured-Drape',
  SAREE: 'Saree',
  SHERWANI: 'Sherwani',
  JODHPURI: 'Jodhpuri',
  BANDHGALA: 'Bandhgala',
  NEHRU_JACKET: 'Nehru-Jacket',
  KURTA_SET: 'Kurta-Set',
  
  // Safar (Travel)
  TRAVEL_PACK: 'Travel-Pack',
  RESORT_WEAR: 'Resort-Wear',
  VACATION_DRESS: 'Vacation-Dress',
  KAFTAN: 'Kaftan',
  POWER_CASUAL: 'Power-Casual',
  BLAZER: 'Blazer',
  JUMPSUIT: 'Jumpsuit',
  MAXI_DRESS: 'Maxi-Dress',
  BEACH_WEAR: 'Beach-Wear',
  
  // Alankrit (Jewelry)
  NECKLACE: 'Necklace',
  CHOKER: 'Choker',
  EARRINGS: 'Earrings',
  BANGLES: 'Bangles',
  MAANG_TIKKA: 'Maang-Tikka',
  BRACELET: 'Bracelet',
  
  // Niche-Luxe
  MATERNITY: 'Maternity',
  NURSING_WEAR: 'Nursing-Wear',
  PLUS_SIZE: 'Plus-Size',
  LUXURY_BAG: 'Luxury-Bag',
  DESIGNER_HANDBAG: 'Designer-Handbag',
  
  // Completers
  MOJARI: 'Mojari',
  JUTTI: 'Jutti',
  KOLHAPURI: 'Kolhapuri',
  DESIGNER_HEELS: 'Designer-Heels',
  LUXURY_SNEAKERS: 'Luxury-Sneakers',
  CLUTCH: 'Clutch',
  
  OTHER: 'Other'
};

export const OCCASIONS = {
  WEDDING: 'Wedding',
  SANGEET: 'Sangeet',
  MEHENDI: 'Mehendi',
  RECEPTION: 'Reception',
  ENGAGEMENT: 'Engagement',
  FESTIVAL: 'Festival',
  PARTY: 'Party',
  CORPORATE: 'Corporate',
  VACATION: 'Vacation',
  BEACH: 'Beach',
  HILL_STATION: 'Hill-Station',
  DAILY_WEAR: 'Daily-Wear',
  DATE_NIGHT: 'Date-Night',
  BRUNCH: 'Brunch',
  COCKTAIL: 'Cocktail',
  TRADITIONAL_EVENT: 'Traditional-Event'
};

export const VIBES = {
  NEON_GOTHIC: 'Neon-Gothic',
  MERMAIDCORE: 'Mermaidcore',
  COTTAGECORE: 'Cottagecore',
  DARK_ACADEMIA: 'Dark-Academia',
  COASTAL_GRANDMOTHER: 'Coastal-Grandmother',
  CLEAN_GIRL: 'Clean-Girl',
  BARBIECORE: 'Barbiecore',
  Y2K: 'Y2K',
  MINIMALIST: 'Minimalist',
  MAXIMALIST: 'Maximalist',
  BOHEMIAN: 'Bohemian',
  ROYAL: 'Royal',
  CONTEMPORARY: 'Contemporary'
};

export const GENDERS = {
  WOMEN: 'Women',
  MEN: 'Men',
  KIDS: 'Kids',
  UNISEX: 'Unisex'
};

// Category to Pillar Mapping
export const CATEGORY_TO_PILLAR = {
  // Utsav
  [CATEGORIES.LEHENGA]: PILLARS.UTSAV,
  [CATEGORIES.ANARKALI]: PILLARS.UTSAV,
  [CATEGORIES.SHARARA]: PILLARS.UTSAV,
  [CATEGORIES.STRUCTURED_DRAPE]: PILLARS.UTSAV,
  [CATEGORIES.SAREE]: PILLARS.UTSAV,
  [CATEGORIES.SHERWANI]: PILLARS.UTSAV,
  [CATEGORIES.JODHPURI]: PILLARS.UTSAV,
  [CATEGORIES.BANDHGALA]: PILLARS.UTSAV,
  [CATEGORIES.NEHRU_JACKET]: PILLARS.UTSAV,
  [CATEGORIES.KURTA_SET]: PILLARS.UTSAV,
  
  // Safar
  [CATEGORIES.TRAVEL_PACK]: PILLARS.SAFAR,
  [CATEGORIES.RESORT_WEAR]: PILLARS.SAFAR,
  [CATEGORIES.VACATION_DRESS]: PILLARS.SAFAR,
  [CATEGORIES.KAFTAN]: PILLARS.SAFAR,
  [CATEGORIES.POWER_CASUAL]: PILLARS.SAFAR,
  [CATEGORIES.BLAZER]: PILLARS.SAFAR,
  [CATEGORIES.JUMPSUIT]: PILLARS.SAFAR,
  [CATEGORIES.MAXI_DRESS]: PILLARS.SAFAR,
  [CATEGORIES.BEACH_WEAR]: PILLARS.SAFAR,
  
  // Alankrit
  [CATEGORIES.NECKLACE]: PILLARS.ALANKRIT,
  [CATEGORIES.CHOKER]: PILLARS.ALANKRIT,
  [CATEGORIES.EARRINGS]: PILLARS.ALANKRIT,
  [CATEGORIES.BANGLES]: PILLARS.ALANKRIT,
  [CATEGORIES.MAANG_TIKKA]: PILLARS.ALANKRIT,
  [CATEGORIES.BRACELET]: PILLARS.ALANKRIT,
  
  // Niche-Luxe
  [CATEGORIES.MATERNITY]: PILLARS.NICHE_LUXE,
  [CATEGORIES.NURSING_WEAR]: PILLARS.NICHE_LUXE,
  [CATEGORIES.PLUS_SIZE]: PILLARS.NICHE_LUXE,
  [CATEGORIES.LUXURY_BAG]: PILLARS.NICHE_LUXE,
  [CATEGORIES.DESIGNER_HANDBAG]: PILLARS.NICHE_LUXE,
  
  // Completers
  [CATEGORIES.MOJARI]: PILLARS.COMPLETERS,
  [CATEGORIES.JUTTI]: PILLARS.COMPLETERS,
  [CATEGORIES.KOLHAPURI]: PILLARS.COMPLETERS,
  [CATEGORIES.DESIGNER_HEELS]: PILLARS.COMPLETERS,
  [CATEGORIES.LUXURY_SNEAKERS]: PILLARS.COMPLETERS,
  [CATEGORIES.CLUTCH]: PILLARS.COMPLETERS
};

// Helper Functions
export const getPillarForCategory = (category) => {
  return CATEGORY_TO_PILLAR[category] || null;
};

export const getCategoriesForPillar = (pillar) => {
  return Object.entries(CATEGORY_TO_PILLAR)
    .filter(([_, p]) => p === pillar)
    .map(([category, _]) => category);
};

export const getPillarDescription = (pillar) => {
  const descriptions = {
    [PILLARS.UTSAV]: 'Premium ethnic wear for life\'s most precious moments',
    [PILLARS.SAFAR]: 'Curated destination bundles and resort wear for your journeys',
    [PILLARS.ALANKRIT]: 'Nizami heritage pieces and contemporary jewelry',
    [PILLARS.NICHE_LUXE]: 'Luxury for every body - capturing the missing middle',
    [PILLARS.COMPLETERS]: 'Essential footwear and accessories to complete your look'
  };
  return descriptions[pillar] || '';
};

export const getPillarStrategy = (pillar) => {
  const strategies = {
    [PILLARS.UTSAV]: 'High price per rental, low frequency - the bread and butter',
    [PILLARS.SAFAR]: 'Subscription-friendly, high frequency - keeps users coming back',
    [PILLARS.ALANKRIT]: 'Requires higher security (pre-auth holds) - premium perception',
    [PILLARS.NICHE_LUXE]: 'Captures the "Missing Middle" market gap - specialized',
    [PILLARS.COMPLETERS]: 'Essential add-ons that complete the outfit - cross-sell opportunity'
  };
  return strategies[pillar] || '';
};

// Occasion to Categories Mapping (for task-based navigation)
export const OCCASION_CATEGORIES = {
  [OCCASIONS.WEDDING]: [CATEGORIES.LEHENGA, CATEGORIES.SHERWANI, CATEGORIES.ANARKALI, CATEGORIES.SAREE],
  [OCCASIONS.SANGEET]: [CATEGORIES.SHARARA, CATEGORIES.KURTA_SET, CATEGORIES.ANARKALI],
  [OCCASIONS.VACATION]: [CATEGORIES.TRAVEL_PACK, CATEGORIES.RESORT_WEAR, CATEGORIES.BEACH_WEAR],
  [OCCASIONS.CORPORATE]: [CATEGORIES.POWER_CASUAL, CATEGORIES.BLAZER],
  [OCCASIONS.PARTY]: [CATEGORIES.JUMPSUIT, CATEGORIES.MAXI_DRESS, CATEGORIES.VACATION_DRESS],
  [OCCASIONS.FESTIVAL]: [CATEGORIES.KURTA_SET, CATEGORIES.ANARKALI, CATEGORIES.SAREE]
};
