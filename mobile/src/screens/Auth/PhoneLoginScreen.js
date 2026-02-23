import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

const PhoneLoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [requiresRegistration, setRequiresRegistration] = useState(false);
  const [timer, setTimer] = useState(0);
  const { sendOTP, verifyOTP } = useAuth();

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    const result = await sendOTP(phone);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'OTP sent to your phone!');
      setOtpSent(true);
      setTimer(60);
      
      // Log OTP in dev mode
      if (result.data.devOTP) {
        console.log('DEV OTP:', result.data.devOTP);
        Alert.alert('DEV MODE', `OTP: ${result.data.devOTP}`);
      }
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter 6-digit OTP');
      return;
    }

    if (requiresRegistration && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    const result = await verifyOTP(phone, otp, name || null);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        result.isNewUser ? 'Account created!' : 'Login successful!'
      );
    } else {
      Alert.alert('Error', result.message);
      if (result.requiresRegistration) {
        setRequiresRegistration(true);
      }
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    setOtp('');
    setOtpSent(false);
    handleSendOTP();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.title}>Phone Login</Text>
          <Text style={styles.subtitle}>Login with OTP</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            {otpSent ? 'Verify OTP' : 'Enter Phone Number'}
          </Text>

          {!otpSent ? (
            <>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="9876543210"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              <Text style={styles.hint}>Enter 10-digit Indian mobile number</Text>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {requiresRegistration && (
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              )}

              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="000000"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />

              <View style={styles.otpInfo}>
                <Text style={styles.otpInfoText}>
                  OTP sent to +91 ******{phone.slice(-4)}
                </Text>
                {timer > 0 ? (
                  <Text style={styles.timerText}>Resend in {timer}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify & Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeNumberButton}
                onPress={() => {
                  setOtpSent(false);
                  setOtp('');
                  setRequiresRegistration(false);
                }}
              >
                <Text style={styles.changeNumberText}>Change Number</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back to Email Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 8,
  },
  countryCode: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#6b7280',
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  otpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  otpInfoText: {
    fontSize: 12,
    color: '#6b7280',
  },
  timerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  resendText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  sendButton: {
    height: 50,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButton: {
    height: 50,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  changeNumberButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  changeNumberText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
});

export default PhoneLoginScreen;
