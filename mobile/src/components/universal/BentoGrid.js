import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

/**
 * Bento Grid Layout Component
 * - Gen Z aesthetic (modular, asymmetric)
 * - Flexible item sizing
 * - Maximizes screen real estate
 * - Instagram/Pinterest inspiration
 */
const BentoGrid = ({ children, scrollable = false }) => {
  const GridComponent = scrollable ? ScrollView : View;

  return (
    <GridComponent
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={scrollable && styles.scrollContent}
    >
      <View style={styles.grid}>{children}</View>
    </GridComponent>
  );
};

/**
 * Bento Grid Items with predefined sizes
 */
const BentoItem = ({ children, size = 'medium', style }) => {
  return <View style={[styles.item, styles[`${size}Item`], style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8, // Modern gap property (RN 0.71+)
  },

  item: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Item sizes (responsive to screen width)
  // Using percentage-based widths for flexibility
  smallItem: {
    width: '31%', // 3 columns with gaps
    aspectRatio: 1, // Square
  },

  mediumItem: {
    width: '48%', // 2 columns with gaps
    aspectRatio: 3 / 4, // Portrait rectangle
  },

  largeItem: {
    width: '100%', // Full width
    aspectRatio: 16 / 9, // Landscape rectangle
  },

  heroItem: {
    width: '100%',
    aspectRatio: 4 / 5, // Tall hero card
  },

  wideItem: {
    width: '65%', // Asymmetric width
    aspectRatio: 3 / 2,
  },

  tallItem: {
    width: '31%',
    aspectRatio: 2 / 3, // Vertical card
  },
});

BentoGrid.Item = BentoItem;

export default BentoGrid;
