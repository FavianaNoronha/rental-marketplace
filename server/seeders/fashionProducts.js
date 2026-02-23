const fashionProducts = [
  {
    title: "Benarasi Silk Saree - Royal Blue with Gold Zari",
    description: "Exquisite handwoven Benarasi silk saree perfect for weddings. Intricate gold zari work with traditional motifs.",
    pillar: "Utsav",
    category: "Saree",
    gender: "Women",
    occasion: "Wedding",
    vibe: ["Royal", "Contemporary"],
    condition: "Like New",
    listingType: "rent",
    price: {
      rent: {
        perDay: 2999,
        perWeek: 8999,
        deposit: 15000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800" },
      { url: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=800" }
    ],
    specifications: {
      brand: "Traditional Benarasi",
      size: "Free Size",
      color: "Royal Blue",
      material: "Pure Silk"
    },
    tags: ["wedding", "saree", "silk", "traditional"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true
  },
  {
    title: "Designer Anarkali Suit - Emerald Green",
    description: "Stunning Anarkali with intricate gota patti work. Perfect for sangeet and mehendi ceremonies.",
    pillar: "Utsav",
    category: "Anarkali",
    gender: "Women",
    occasion: "Sangeet",
    vibe: ["Royal", "Contemporary"],
    condition: "New",
    listingType: "both",
    price: {
      sale: 8999,
      rent: {
        perDay: 1999,
        perWeek: 5499,
        deposit: 10000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800" },
      { url: "https://images.unsplash.com/photo-1617627143750-3d175e8d22c9?w=800" }
    ],
    specifications: {
      brand: "Studio Collection",
      size: "M",
      color: "Emerald Green",
      material: "Georgette"
    },
    tags: ["anarkali", "wedding", "festive"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true,
    discount: 15
  },
  {
    title: "Groom Sherwani - Ivory with Gold Embroidery",
    description: "Regal ivory sherwani with intricate gold embroidery. Includes matching pajama and stole.",
    pillar: "Utsav",
    category: "Sherwani",
    gender: "Men",
    occasion: "Wedding",
    vibe: ["Royal"],
    condition: "Like New",
    listingType: "rent",
    price: {
      rent: {
        perDay: 3999,
        perWeek: 11999,
        deposit: 18000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1599481238640-4c1288750d7a?w=800" },
      { url: "https://images.unsplash.com/photo-1598808503491-8a6000c633c8?w=800" }
    ],
    specifications: {
      brand: "Royal Men",
      size: "L",
      color: "Ivory Gold",
      material: "Raw Silk"
    },
    tags: ["sherwani", "groom", "wedding"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true
  },
  {
    title: "Lehenga Choli - Peach with Mirror Work",
    description: "Contemporary lehenga with traditional mirror work and sequins. Perfect for receptions.",
    pillar: "Utsav",
    category: "Lehenga",
    gender: "Women",
    occasion: "Reception",
    vibe: ["Contemporary", "Maximalist"],
    condition: "New",
    listingType: "both",
    price: {
      sale: 12999,
      rent: {
        perDay: 2499,
        perWeek: 6999,
        deposit: 15000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800" },
      { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800" }
    ],
    specifications: {
      brand: "Ethnic Studio",
      size: "S",
      color: "Peach",
      material: "Net"
    },
    tags: ["lehenga", "wedding", "festive"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true,
    discount: 20
  },
  {
    title: "Linen Beach Jumpsuit - White",
    description: "Elegant white linen jumpsuit perfect for beach vacations. Breathable fabric with relaxed fit.",
    pillar: "Safar",
    category: "Jumpsuit",
    gender: "Women",
    occasion: "Beach",
    vibe: ["Coastal-Grandmother", "Minimalist"],
    condition: "Good",
    listingType: "rent",
    price: {
      rent: {
        perDay: 599,
        perWeek: 1499,
        deposit: 3000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" },
      { url: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800" }
    ],
    specifications: {
      brand: "Zara",
      size: "M",
      color: "White",
      material: "Linen"
    },
    tags: ["beach", "vacation", "resort"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true
  },
  {
    title: "Floral Maxi Dress - Summer Collection",
    description: "Breezy floral print maxi dress for vacation vibes. Perfect for brunches and beach walks.",
    pillar: "Safar",
    category: "Maxi-Dress",
    gender: "Women",
    occasion: "Vacation",
    vibe: ["Cottagecore", "Bohemian"],
    condition: "Like New",
    listingType: "both",
    price: {
      sale: 2999,
      rent: {
        perDay: 499,
        perWeek: 1299,
        deposit: 2500
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800" },
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800" }
    ],
    specifications: {
      brand: "H&M",
      size: "S",
      color: "Floral Multi",
      material: "Cotton Blend"
    },
    tags: ["dress", "vacation", "floral"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true
  },
  {
    title: "Power Blazer Set - Navy Blue",
    description: "Professional blazer and trouser set for corporate events. Tailored fit with modern cut.",
    pillar: "Safar",
    category: "Blazer",
    gender: "Women",
    occasion: "Corporate",
    vibe: ["Minimalist", "Contemporary"],
    condition: "New",
    listingType: "rent",
    price: {
      rent: {
        perDay: 899,
        perWeek: 2499,
        deposit: 5000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800" },
      { url: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800" }
    ],
    specifications: {
      brand: "Van Heusen",
      size: "M",
      color: "Navy Blue",
      material: "Polyester Wool Blend"
    },
    tags: ["blazer", "formal", "corporate"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true
  },
  {
    title: "Luxury Designer Handbag - Black Leather",
    description: "Premium leather designer handbag for special occasions. Timeless piece with gold hardware.",
    pillar: "Niche-Luxe",
    category: "Designer-Handbag",
    gender: "Women",
    occasion: "Party",
    vibe: ["Minimalist", "Contemporary"],
    condition: "Like New",
    listingType: "rent",
    price: {
      rent: {
        perDay: 1999,
        perWeek: 5499,
        deposit: 12000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800" },
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800" }
    ],
    specifications: {
      brand: "Designer Collection",
      size: "Medium",
      color: "Black",
      material: "Genuine Leather"
    },
    tags: ["designer", "luxury", "handbag"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true
  },
  {
    title: "Gold Statement Necklace Set",
    description: "Stunning gold-plated necklace with matching earrings. Perfect for weddings and special occasions.",
    pillar: "Alankrit",
    category: "Necklace",
    gender: "Women",
    occasion: "Wedding",
    vibe: ["Royal", "Maximalist"],
    condition: "New",
    listingType: "rent",
    price: {
      rent: {
        perDay: 1499,
        perWeek: 4499,
        deposit: 8000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800" },
      { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800" }
    ],
    specifications: {
      brand: "Jewel Palace",
      size: "Standard",
      color: "Gold",
      material: "Gold Plated"
    },
    tags: ["jewelry", "necklace", "wedding"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true
  },
  {
    title: "Designer Mojari - Embroidered",
    description: "Handcrafted mojari with intricate embroidery. Perfect complement to ethnic wear.",
    pillar: "Completers",
    category: "Mojari",
    gender: "Men",
    occasion: "Wedding",
    vibe: ["Royal", "Contemporary"],
    condition: "New",
    listingType: "rent",
    price: {
      rent: {
        perDay: 399,
        perWeek: 999,
        deposit: 2000
      }
    },
    images: [
      { url: "https://images.unsplash.com/photo-1603808033587-74e5104ee615?w=800" },
      { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" }
    ],
    specifications: {
      brand: "Ethnic Footwear",
      size: "10",
      color: "Gold",
      material: "Velvet"
    },
    tags: ["mojari", "footwear", "ethnic"],
    location: { city: "Hyderabad", state: "Telangana" },
    verified: true
  }
];

module.exports = fashionProducts;
