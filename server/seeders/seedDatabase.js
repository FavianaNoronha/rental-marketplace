const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const fashionProducts = require('./fashionProducts');
require('dotenv').config();

/**
 * Database Seeder for Fashion Products
 * Seeds database with sample products with real images
 */

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-marketplace', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find or create a demo seller
    let demoSeller = await User.findOne({ email: 'demo@closetly.com' });
    
    if (!demoSeller) {
      console.log('👤 Creating demo seller account...');
      demoSeller = await User.create({
        name: 'Closetly Demo',
        email: 'demo@closetly.com',
        phone: '9876543210',
        password: 'Demo@123',
        role: 'user',
        verified: true,
        premium: {
          isActive: true,
          plan: 'pro',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        },
        kycStatus: 'verified'
      });
      console.log('✅ Demo seller created');
    } else {
      console.log('✅ Using existing demo seller');
    }

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('🗑️  Cleared existing products');

    // Seed products
    console.log('📦 Seeding products...');
    
    const productsToSeed = fashionProducts.map(product => ({
      ...product,
      seller: demoSeller._id,
      status: 'active',
      views: Math.floor(Math.random() * 1000),
      likesCount: Math.floor(Math.random() * 100),
      commentsCount: Math.floor(Math.random() * 20),
      waitlistCount: Math.floor(Math.random() * 10),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
    }));

    const createdProducts = await Product.insertMany(productsToSeed);
    
    console.log(`✅ Successfully seeded ${createdProducts.length} products`);
    console.log('\n📊 Product Summary:');
    
    const categories = {};
    createdProducts.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📝 Login credentials for testing:');
    console.log('   Email: demo@closetly.com');
    console.log('   Password: Demo@123');
    console.log('\n💡 You can now browse products in the feed!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
