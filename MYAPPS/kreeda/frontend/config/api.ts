import Constants from 'expo-constants';
import { Platform } from 'react-native';

// API Configuration
const API_CONFIG = {
  // Development URLs
  development: {
    // For iOS Simulator and Android Emulator
    emulator: 'http://localhost:4000/api',
    // For physical devices, fall back to production API
    device: 'https://api.krida-sports.com/api',
    // For web development
    web: 'http://localhost:4000/api',
  },
  // Production URL
  production: {
    default: 'https://api.krida-sports.com/api',
  },
};

/**
 * Get the appropriate API base URL based on the environment and platform
 */
export const getApiBaseUrl = (): string => {
  const isDevelopment = __DEV__ || Constants.expoConfig?.extra?.environment === 'development';
  
  if (isDevelopment) {
    // Development environment
    if (Platform.OS === 'web') {
      return API_CONFIG.development.web;
    }
    
    // Check if running on device or emulator
    // In Expo, Constants.isDevice tells us if it's a physical device
    const isDevice = Constants.isDevice;
    
    if (isDevice) {
      console.log('🔗 Running on physical device, using production API URL');
      console.log('📱 Physical devices will use the production API for better compatibility');
      return API_CONFIG.development.device;
    } else {
      console.log('🔗 Running on emulator/simulator, using localhost API URL');
      return API_CONFIG.development.emulator;
    }
  } else {
    // Production environment
    return API_CONFIG.production.default;
  }
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
  },
  
  // Events
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    GET_BY_ID: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
    REGISTER: (id: string) => `/events/${id}/register`,
    UNREGISTER: (id: string) => `/events/${id}/unregister`,
  },
  
  // AI Coach
  AI_COACH: {
    CHAT: '/ai-coach/chat',
    PLANS: '/ai-coach/plans',
    METRICS: '/ai-coach/metrics',
    INSIGHTS: '/ai-coach/insights',
    CREATE_PLAN: '/ai-coach/create-plan',
  },
  
  // Sports (if implemented)
  SPORTS: '/sports',
  
  // News (if implemented)
  NEWS: '/news',
};

// Export the base URL and a configured axios instance
export const API_BASE_URL = getApiBaseUrl();

console.log(`🚀 API configured for ${__DEV__ ? 'development' : 'production'}: ${API_BASE_URL}`);
