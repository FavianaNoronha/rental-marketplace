import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { BentoGrid, Card, Badge } from '../../components/universal';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  const categories = [
    { id: 1, name: 'Utsav', icon: 'sparkles', color: '#FF6B9D', subtitle: 'Weddings & Celebrations' },
    { id: 2, name: 'Safar', icon: 'airplane', color: '#4ECDC4', subtitle: 'Travel & Adventure' },
    { id: 3, name: 'Alankrit', icon: 'diamond', color: '#FFE66D', subtitle: 'Traditional Elegance' },
    { id: 4, name: 'Niche-Luxe', icon: 'star', color: '#C7B3FF', subtitle: 'Designer Collection' },
  ];

  // Mock featured products (will be replaced with real data)
  const featuredItems = [
    {
      id: 1,
      name: 'Sabyasachi Lehenga',
      price: '₹1,999/day',
      image: 'https://via.placeholder.com/400x500/FF6B9D/FFFFFF?text=Sabyasachi',
      sanitized: true,
      verified: true,
      distance: '2.3 km',
    },
    {
      id: 2,
      name: 'Raw Mango Kurta Set',
      price: '₹799/day',
      image: 'https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Raw+Mango',
      sanitized: true,
      verified: true,
      distance: '4.1 km',
    },
    {
      id: 3,
      name: 'Anarkali Suit',
      price: '₹599/day',
      image: 'https://via.placeholder.com/300x300/FFE66D/000000?text=Anarkali',
      sanitized: false,
      verified: true,
      distance: '1.8 km',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name || 'Guest'}! 👋
            </Text>
            <Text style={styles.subtitle}>
              Discover fashion rentals near you
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => {/* Notification screen */}}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Occasion</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Explore', { category: category.name })}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[category.color, adjustColor(category.color, -20)]}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={category.icon} size={32} color="#fff" />
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Items - Bento Grid Layout */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Near You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Bento Grid Implementation */}
          <BentoGrid scrollable={false}>
            {/* Hero Item - Large */}
            <BentoGrid.Item size="hero">
              <FeaturedProductCard 
                item={featuredItems[0]} 
                size="large"
                onPress={() => navigation.navigate('ProductDetail', { productId: featuredItems[0].id })}
              />
            </BentoGrid.Item>

            {/* Medium Items - 2 columns */}
            <BentoGrid.Item size="medium">
              <FeaturedProductCard 
                item={featuredItems[1]} 
                size="medium"
                onPress={() => navigation.navigate('ProductDetail', { productId: featuredItems[1].id })}
              />
            </BentoGrid.Item>

            <BentoGrid.Item size="medium">
              <FeaturedProductCard 
                item={featuredItems[2]} 
                size="medium"
                onPress={() => navigation.navigate('ProductDetail', { productId: featuredItems[2].id })}
              />
            </BentoGrid.Item>
          </BentoGrid>
        </View>

        {/* Trust Banner */}
        <View style={styles.section}>
          <Card variant="outlined" style={styles.trustBanner}>
            <View style={styles.trustRow}>
              <Ionicons name="shield-checkmark" size={24} color="#059669" />
              <View style={styles.trustTextContainer}>
                <Text style={styles.trustTitle}>Bank-Grade Security</Text>
                <Text style={styles.trustSubtitle}>
                  Aadhaar KYC verified • Digital sanitization • Escrow payments
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

// Featured Product Card Component
const FeaturedProductCard = ({ item, size, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={{ flex: 1 }}>
      <Card variant="elevated" style={styles.productCard}>
        {/* Product Image */}
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.productOverlay}
        >
          {/* Badges at top */}
          <View style={styles.badgeContainer}>
            {item.sanitized && (
              <Badge 
                text="Sanitized" 
                variant="success" 
                icon="shield-checkmark"
                size="small"
              />
            )}
            {item.verified && (
              <Badge 
                text="KYC Verified" 
                variant="info" 
                icon="checkmark-circle"
                size="small"
              />
            )}
          </View>

          {/* Product Info at bottom */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={size === 'medium' ? 1 : 2}>
              {item.name}
            </Text>
            <View style={styles.productFooter}>
              <Text style={styles.productPrice}>{item.price}</Text>
              <View style={styles.distanceTag}>
                <Ionicons name="location" size={12} color="#fff" />
                <Text style={styles.distanceText}>{item.distance}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Card>
    </TouchableOpacity>
  );
};

// Helper function to darken colors for gradient
const adjustColor = (color, amount) => {
  const clamp = (val) => Math.min(Math.max(val, 0), 255);
  const num = parseInt(color.replace('#', ''), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00FF) + amount);
  const b = clamp((num & 0x0000FF) + amount);
  return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Gray-50
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.95,
  },
  notificationButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B9D',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // Gray-800
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1', // Indigo-600
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  categorySubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  productCard: {
    flex: 1,
    padding: 0,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  productOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  productInfo: {
    gap: 6,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  trustBanner: {
    marginTop: 8,
    marginBottom: 24,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustTextContainer: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  trustSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});

export default HomeScreen;
