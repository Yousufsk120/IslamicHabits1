import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogIn, Mail, Phone, Apple } from 'lucide-react';
import { useAuth, User } from '../contexts/AuthContext';

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'google' | 'apple'>('email');
  const [credentials, setCredentials] = useState({ email: '', phone: '', name: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleEmailLogin = () => {
    // Simulate email login - in real app, this would validate credentials
    if (credentials.email && credentials.name) {
      const newUser: User = {
        id: Date.now().toString(),
        name: credentials.name,
        email: credentials.email,
        points: 0,
        level: 1,
        achievements: ['Welcome to Islamic Habits! 🎉'],
        joinDate: new Date(),
        habits: {
          prayers: { completed: 0, streak: 0 },
          quran: { completed: 0, streak: 0 },
          dhikr: { completed: 0, streak: 0 },
          charity: { completed: 0, streak: 0 }
        }
      };
      login(newUser);
      onClose();
    }
  };

  const handlePhoneLogin = () => {
    if (!otpSent) {
      // Simulate OTP sending
      setOtpSent(true);
    } else if (otp === '123456') { // Mock OTP verification
      const newUser: User = {
        id: Date.now().toString(),
        name: credentials.name || 'User',
        phone: credentials.phone,
        points: 0,
        level: 1,
        achievements: ['Welcome to Islamic Habits! 🎉'],
        joinDate: new Date(),
        habits: {
          prayers: { completed: 0, streak: 0 },
          quran: { completed: 0, streak: 0 },
          dhikr: { completed: 0, streak: 0 },
          charity: { completed: 0, streak: 0 }
        }
      };
      login(newUser);
      onClose();
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google login
    const newUser: User = {
      id: 'google_' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://via.placeholder.com/32?text=G',
      points: 0,
      level: 1,
      achievements: ['Welcome to Islamic Habits! 🎉'],
      joinDate: new Date(),
      habits: {
        prayers: { completed: 0, streak: 0 },
        quran: { completed: 0, streak: 0 },
        dhikr: { completed: 0, streak: 0 },
        charity: { completed: 0, streak: 0 }
      }
    };
    login(newUser);
    onClose();
  };

  const handleAppleLogin = () => {
    // Simulate Apple login
    const newUser: User = {
      id: 'apple_' + Date.now(),
      name: 'Apple User',
      email: 'user@icloud.com',
      avatar: 'https://via.placeholder.com/32?text=A',
      points: 0,
      level: 1,
      achievements: ['Welcome to Islamic Habits! 🎉'],
      joinDate: new Date(),
      habits: {
        prayers: { completed: 0, streak: 0 },
        quran: { completed: 0, streak: 0 },
        dhikr: { completed: 0, streak: 0 },
        charity: { completed: 0, streak: 0 }
      }
    };
    login(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('login')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Login method selection */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'email' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'phone' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Phone
            </button>
          </div>

          {/* Email Login */}
          {loginMethod === 'email' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={credentials.name}
                onChange={(e) => setCredentials({...credentials, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleEmailLogin}
                className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                {t('login')}
              </button>
            </div>
          )}

          {/* Phone Login */}
          {loginMethod === 'phone' && (
            <div className="space-y-3">
              {!otpSent ? (
                <>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={credentials.name}
                    onChange={(e) => setCredentials({...credentials, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="tel"
                    placeholder={t('phoneNumber')}
                    value={credentials.phone}
                    onChange={(e) => setCredentials({...credentials, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handlePhoneLogin}
                    className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 text-center">
                    Enter OTP sent to {credentials.phone}
                  </p>
                  <input
                    type="text"
                    placeholder={t('enterOTP')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Demo OTP: 123456
                  </p>
                  <button
                    onClick={handlePhoneLogin}
                    className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Verify & Login
                  </button>
                </>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-2">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              {t('loginWithGoogle')}
            </button>
            <button
              onClick={handleAppleLogin}
              className="w-full bg-gray-900 text-white p-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <Apple className="h-5 w-5 mr-2" />
              {t('loginWithApple')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;