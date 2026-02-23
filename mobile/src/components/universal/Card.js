import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Universal Card Component
 * - Bento grid support (flexible sizing)
 * - High contrast shadows
 * - Accessible touch targets
 */
const Card = ({
  children,
  size = 'medium', // small | medium | large | full
  variant = 'elevated', // elevated | flat | outlined
  onPress,
  style,
  ...props
}) => {
  const cardStyles = [
    styles.baseCard,
    styles[`${size}Card`],
    styles[variant],
    onPress && styles.touchable,
    style,
  ];

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={cardStyles}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Bento grid sizes
  smallCard: {
    minHeight: 120,
    padding: 12,
  },

  mediumCard: {
    minHeight: 180,
    padding: 16,
  },

  largeCard: {
    minHeight: 250,
    padding: 20,
  },

  fullCard: {
    minHeight: 300,
    padding: 24,
  },

  // Variants
  elevated: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  flat: {
    backgroundColor: '#F9FAFB', // Gray-50
  },

  outlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB', // Gray-200
  },

  // Touchable feedback
  touchable: {
    minHeight: 44, // Accessible touch target
  },
});

export default Card;
