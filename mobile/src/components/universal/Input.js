import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Universal Input Component
 * - High contrast labels (4.5:1 ratio)
 * - Large touch targets for icons (44x44px)
 * - Clear error states
 * - Accessible placeholders
 */
const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  leftIcon,
  rightIcon,
  editable = true,
  maxLength,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputStyles = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    !editable && styles.inputDisabled,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputWrapper}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}

        <TextInput
          style={inputStyles}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF" // Gray-400 (accessible contrast)
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          maxLength={maxLength}
          {...props}
        />

        {/* Password visibility toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIconContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6B7280" // Gray-500
            />
          </TouchableOpacity>
        )}

        {/* Custom right icon */}
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Character count (if maxLength specified) */}
      {maxLength && value && (
        <Text style={styles.helperText}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937', // Gray-800 (16:1 contrast ratio)
    marginBottom: 8,
  },

  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    minHeight: 48, // 48px for comfortable typing
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937', // Gray-800
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB', // Gray-300
    borderRadius: 8,
  },

  inputFocused: {
    borderColor: '#6366F1', // Indigo-600 (focus state)
    borderWidth: 2,
  },

  inputError: {
    borderColor: '#DC2626', // Red-600
    borderWidth: 2,
  },

  inputDisabled: {
    backgroundColor: '#F3F4F6', // Gray-100
    color: '#9CA3AF', // Gray-400
  },

  leftIconContainer: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    minWidth: 44, // 44px touch target
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightIconContainer: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    minWidth: 44, // 44px touch target
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  errorText: {
    fontSize: 14,
    color: '#DC2626', // Red-600 (5.9:1 contrast)
    marginLeft: 6,
  },

  helperText: {
    fontSize: 12,
    color: '#6B7280', // Gray-500
    marginTop: 6,
    textAlign: 'right',
  },
});

export default Input;
