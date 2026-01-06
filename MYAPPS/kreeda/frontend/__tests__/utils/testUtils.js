import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

/**
 * Custom render function that wraps components with necessary providers
 */
export const renderWithNavigation = (component, navigationProps = {}) => {
  const MockedNavigator = ({ children }) => (
    <NavigationContainer>
      {children}
    </NavigationContainer>
  );

  return render(
    <MockedNavigator>
      {component}
    </MockedNavigator>
  );
};

/**
 * Test utilities for component testing
 */
export class ComponentTestUtils {
  /**
   * Find element by test ID
   */
  static findByTestId = (component, testId) => {
    return component.getByTestId(testId);
  };

  /**
   * Find element by text content
   */
  static findByText = (component, text) => {
    return component.getByText(text);
  };

  /**
   * Check if element exists by test ID
   */
  static existsByTestId = (component, testId) => {
    try {
      component.getByTestId(testId);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Wait for element to appear
   */
  static waitForElement = async (component, testId) => {
    return await waitFor(() => component.getByTestId(testId));
  };

  /**
   * Simulate text input
   */
  static changeText = (element, text) => {
    fireEvent.changeText(element, text);
  };

  /**
   * Simulate button press
   */
  static press = (element) => {
    fireEvent.press(element);
  };

  /**
   * Simulate scroll event
   */
  static scroll = (element, eventData) => {
    fireEvent.scroll(element, eventData);
  };

  /**
   * Get all elements by test ID
   */
  static getAllByTestId = (component, testId) => {
    return component.getAllByTestId(testId);
  };
}

/**
 * API mocking utilities
 */
export class ApiMockUtils {
  /**
   * Mock successful API response
   */
  static mockSuccessResponse = (data) => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data,
      }),
    });
  };

  /**
   * Mock API error response
   */
  static mockErrorResponse = (message, status = 400) => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status,
      json: async () => ({
        success: false,
        message,
      }),
    });
  };

  /**
   * Mock network error
   */
  static mockNetworkError = () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
  };

  /**
   * Mock paginated response
   */
  static mockPaginatedResponse = (items, page = 1, totalPages = 1) => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          items,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount: items.length,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      }),
    });
  };

  /**
   * Clear all fetch mocks
   */
  static clearMocks = () => {
    global.fetch.mockClear();
  };
}

/**
 * Form testing utilities
 */
export class FormTestUtils {
  /**
   * Fill form field
   */
  static fillField = (component, testId, value) => {
    const field = component.getByTestId(testId);
    ComponentTestUtils.changeText(field, value);
  };

  /**
   * Submit form
   */
  static submitForm = (component, submitButtonTestId = 'submit-button') => {
    const submitButton = component.getByTestId(submitButtonTestId);
    ComponentTestUtils.press(submitButton);
  };

  /**
   * Check if form field has error
   */
  static hasFieldError = (component, fieldTestId) => {
    const errorTestId = `${fieldTestId}-error`;
    return ComponentTestUtils.existsByTestId(component, errorTestId);
  };

  /**
   * Get form field error message
   */
  static getFieldError = (component, fieldTestId) => {
    const errorTestId = `${fieldTestId}-error`;
    try {
      return component.getByTestId(errorTestId).props.children;
    } catch (error) {
      return null;
    }
  };

  /**
   * Fill entire form with test data
   */
  static fillForm = (component, formData) => {
    Object.entries(formData).forEach(([fieldName, value]) => {
      this.fillField(component, fieldName, value);
    });
  };

  /**
   * Check if form is valid (no error messages)
   */
  static isFormValid = (component, fieldNames) => {
    return !fieldNames.some(fieldName => this.hasFieldError(component, fieldName));
  };
}

/**
 * Navigation testing utilities
 */
export class NavigationTestUtils {
  /**
   * Mock navigation object
   */
  static createMockNavigation = (overrides = {}) => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    dispatch: jest.fn(),
    canGoBack: jest.fn(() => true),
    isFocused: jest.fn(() => true),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    ...overrides,
  });

  /**
   * Mock route object
   */
  static createMockRoute = (params = {}, name = 'TestScreen') => ({
    key: 'test-key',
    name,
    params,
    path: undefined,
  });

  /**
   * Assert navigation was called
   */
  static expectNavigationCalled = (navigation, screen, params = undefined) => {
    if (params) {
      expect(navigation.navigate).toHaveBeenCalledWith(screen, params);
    } else {
      expect(navigation.navigate).toHaveBeenCalledWith(screen);
    }
  };

  /**
   * Assert go back was called
   */
  static expectGoBackCalled = (navigation) => {
    expect(navigation.goBack).toHaveBeenCalled();
  };
}

/**
 * State management testing utilities
 */
export class StateTestUtils {
  /**
   * Wait for state to change
   */
  static waitForStateChange = async (callback, timeout = 1000) => {
    return await waitFor(callback, { timeout });
  };

  /**
   * Mock async storage operations
   */
  static mockAsyncStorage = (data = {}) => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    
    AsyncStorage.getItem.mockImplementation((key) => {
      return Promise.resolve(data[key] || null);
    });
    
    AsyncStorage.setItem.mockImplementation((key, value) => {
      data[key] = value;
      return Promise.resolve();
    });
    
    AsyncStorage.removeItem.mockImplementation((key) => {
      delete data[key];
      return Promise.resolve();
    });
  };

  /**
   * Mock secure store operations
   */
  static mockSecureStore = (data = {}) => {
    const SecureStore = require('expo-secure-store');
    
    SecureStore.getItemAsync.mockImplementation((key) => {
      return Promise.resolve(data[key] || null);
    });
    
    SecureStore.setItemAsync.mockImplementation((key, value) => {
      data[key] = value;
      return Promise.resolve();
    });
    
    SecureStore.deleteItemAsync.mockImplementation((key) => {
      delete data[key];
      return Promise.resolve();
    });
  };
}

/**
 * Event testing utilities
 */
export class EventTestUtils {
  /**
   * Create mock event data
   */
  static createMockEvent = (overrides = {}) => ({
    _id: `event_${Date.now()}`,
    title: 'Test Event',
    description: 'Test event description',
    sport: 'Cricket',
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: '10:00',
    endTime: '12:00',
    location: {
      name: 'Test Venue',
      address: 'Test Address',
      latitude: 19.0760,
      longitude: 72.8777,
    },
    organizer: {
      _id: 'organizer_id',
      name: 'Test Organizer',
    },
    participants: [],
    maxParticipants: 20,
    entryFee: 100,
    difficulty: 'Beginner',
    status: 'upcoming',
    isPublic: true,
    allowSpectators: true,
    provideEquipment: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  /**
   * Create multiple mock events
   */
  static createMockEvents = (count = 3, baseData = {}) => {
    return Array.from({ length: count }, (_, index) =>
      this.createMockEvent({
        ...baseData,
        title: `Test Event ${index + 1}`,
        date: new Date(Date.now() + (86400000 * (index + 1))).toISOString(),
      })
    );
  };
}

/**
 * User testing utilities
 */
export class UserTestUtils {
  /**
   * Create mock user data
   */
  static createMockUser = (overrides = {}) => ({
    _id: `user_${Date.now()}`,
    name: 'Test User',
    email: 'test@example.com',
    level: 5,
    xp: 2500,
    avatar: null,
    sportsInterests: ['Cricket', 'Football'],
    location: 'Mumbai, India',
    age: 25,
    gender: 'Male',
    phoneNumber: '+919876543210',
    bio: 'Test user bio',
    registeredEvents: [],
    organizedEvents: [],
    achievements: [],
    stats: {
      eventsPlayed: 10,
      eventsOrganized: 5,
      winRate: 70,
    },
    preferences: {
      notifications: true,
      publicProfile: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  /**
   * Mock authenticated user state
   */
  static mockAuthenticatedUser = (userData = {}) => {
    const user = this.createMockUser(userData);
    const token = 'mock_jwt_token';
    
    StateTestUtils.mockSecureStore({
      userToken: token,
      userData: JSON.stringify(user),
    });
    
    return { user, token };
  };

  /**
   * Mock unauthenticated user state
   */
  static mockUnauthenticatedUser = () => {
    StateTestUtils.mockSecureStore({});
  };
}

/**
 * Permission testing utilities
 */
export class PermissionTestUtils {
  /**
   * Mock granted permissions
   */
  static mockGrantedPermissions = () => {
    const ImagePicker = require('expo-image-picker');
    const Location = require('expo-location');
    
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: true,
      status: 'granted',
    });
    
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
      granted: true,
      status: 'granted',
    });
    
    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      granted: true,
      status: 'granted',
    });
  };

  /**
   * Mock denied permissions
   */
  static mockDeniedPermissions = () => {
    const ImagePicker = require('expo-image-picker');
    const Location = require('expo-location');
    
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: false,
      status: 'denied',
    });
    
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
      granted: false,
      status: 'denied',
    });
    
    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      granted: false,
      status: 'denied',
    });
  };
}

// Export commonly used testing utilities
export {
  render,
  fireEvent,
  waitFor,
  renderWithNavigation as customRender,
};

// Default export with all utilities
export default {
  ComponentTestUtils,
  ApiMockUtils,
  FormTestUtils,
  NavigationTestUtils,
  StateTestUtils,
  EventTestUtils,
  UserTestUtils,
  PermissionTestUtils,
};
