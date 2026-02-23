import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [requiresRegistration, setRequiresRegistration] = useState(false);
  const [timer, setTimer] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/phone/send-otp', {
        phone: formData.phone
      });

      if (response.data.success) {
        toast.success('OTP sent to your phone!');
        setOtpSent(true);
        setTimer(60); // 60 second timer
        
        // Start countdown
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Log OTP in development mode
        if (response.data.devOTP) {
          console.log('DEV MODE - OTP:', response.data.devOTP);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        phone: formData.phone,
        otp: formData.otp
      };

      // Add name if it's a new registration
      if (requiresRegistration) {
        payload.name = formData.name;
      }

      const response = await api.post('/auth/phone/verify-otp', payload);

      if (response.data.success) {
        // Store token and user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success(response.data.isNewUser ? 'Account created successfully!' : 'Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to verify OTP';
      toast.error(errorMsg);
      
      // Check if registration is required
      if (error.response?.data?.requiresRegistration) {
        setRequiresRegistration(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    
    setFormData({ ...formData, otp: '' }); // Clear OTP field
    setOtpSent(false);
    handleSendOTP({ preventDefault: () => {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loginMethod === 'phone') {
      if (!otpSent) {
        await handleSendOTP(e);
      } else {
        await handleVerifyOTP(e);
      }
      return;
    }
    
    // Email login
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              loginMethod === 'email'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              loginMethod === 'phone'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Phone OTP
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {loginMethod === 'email' ? (
            /* Email Login Form */
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          ) : (
            /* Phone OTP Login Form */
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength="10"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={otpSent}
                    className="input rounded-l-none"
                    placeholder="9876543210"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Enter 10-digit Indian mobile number</p>
              </div>

              {otpSent && (
                <>
                  {requiresRegistration && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="Enter your name"
                      />
                      <p className="mt-1 text-xs text-gray-500">New user? Please provide your name</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength="6"
                      required
                      value={formData.otp}
                      onChange={handleChange}
                      className="input text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <p className="text-gray-500">OTP sent to +91 ******{formData.phone.slice(-4)}</p>
                      {timer > 0 ? (
                        <p className="text-gray-500">Resend in {timer}s</p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          className="font-medium text-primary-600 hover:text-primary-500"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {loginMethod === 'email' && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Please wait...'
              ) : loginMethod === 'email' ? (
                'Sign in'
              ) : otpSent ? (
                'Verify OTP & Login'
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Demo Credentials</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> demo@closetly.com<br />
              <strong>Password:</strong> Demo@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
