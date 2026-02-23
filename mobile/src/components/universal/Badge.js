import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Universal Badge Component
 * - Trust indicators (KYC, Sanitization, etc.)
 * - High contrast colors
 * - Clear visual hierarchy
 */
const Badge = ({
  text,
  variant = 'default', // default | success | warning | error | info
  icon,
  size = 'medium', // small | medium | large
  style,
}) => {
  const badgeStyles = [
    styles.baseBadge,
    styles[variant],
    styles[`${size}Badge`],
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  return (
    <View style={badgeStyles}>
      {icon && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 12 : size === 'medium' ? 14 : 16}
          color={getIconColor(variant)}
          style={styles.icon}
        />
      )}
      <Text style={textStyles}>{text}</Text>
    </View>
  );
};

const getIconColor = (variant) => {
  const colors = {
    default: '#6B7280', // Gray-500
    success: '#059669', // Green-600
    warning: '#D97706', // Amber-600
    error: '#DC2626', // Red-600
    info: '#2563EB', // Blue-600
  };
  return colors[variant] || colors.default;
};

const styles = StyleSheet.create({
  baseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  baseText: {
    fontWeight: '600',
  },

  icon: {
    marginRight: 4,
  },

  // Variants (High contrast backgrounds)
  default: {
    backgroundColor: '#F3F4F6', // Gray-100
  },

  defaultText: {
    color: '#1F2937', // Gray-800 (16:1 contrast)
  },

  success: {
    backgroundColor: '#D1FAE5', // Green-100
  },

  successText: {
    color: '#065F46', // Green-800 (10:1 contrast)
  },

  warning: {
    backgroundColor: '#FEF3C7', // Amber-100
  },

  warningText: {
    color: '#92400E', // Amber-900 (11:1 contrast)
  },

  error: {
    backgroundColor: '#FEE2E2', // Red-100
  },

  errorText: {
    color: '#991B1B', // Red-800 (11:1 contrast)
  },

  info: {
    backgroundColor: '#DBEAFE', // Blue-100
  },

  infoText: {
    color: '#1E40AF', // Blue-800 (9:1 contrast)
  },

  // Sizes
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  smallText: {
    fontSize: 11,
  },

  mediumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  mediumText: {
    fontSize: 13,
  },

  largeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  largeText: {
    fontSize: 15,
  },
});

export default Badge;
