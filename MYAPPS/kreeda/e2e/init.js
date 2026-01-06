const { cleanup, init } = require('detox');
const adapter = require('detox/runners/jest/adapter');

const config = require('../.detoxrc.js');

// Set the default timeout for all tests
jest.setTimeout(300000);

// Detox Jest adapter
jest.setupFilesAfterEnv.push(adapter.setupFilesAfterEnv);

// Global test setup and teardown
beforeAll(async () => {
  await init(config, { initGlobals: false });
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await cleanup();
});

// Global test utilities for E2E tests
global.e2eUtils = {
  // Wait for element to be visible
  waitForElement: async (element, timeout = 10000) => {
    await waitFor(element).toBeVisible().withTimeout(timeout);
  },

  // Wait for element and tap
  tapElement: async (element, timeout = 10000) => {
    await waitFor(element).toBeVisible().withTimeout(timeout);
    await element.tap();
  },

  // Type text in input field
  typeText: async (element, text, timeout = 10000) => {
    await waitFor(element).toBeVisible().withTimeout(timeout);
    await element.typeText(text);
  },

  // Clear text and type new text
  clearAndType: async (element, text, timeout = 10000) => {
    await waitFor(element).toBeVisible().withTimeout(timeout);
    await element.clearText();
    await element.typeText(text);
  },

  // Scroll to element
  scrollToElement: async (scrollView, element, direction = 'down') => {
    await waitFor(element).toBeVisible().whileElement(by.id(scrollView)).scroll(500, direction);
  },

  // Take screenshot
  takeScreenshot: async (name) => {
    await device.takeScreenshot(name);
  },

  // Reload app
  reloadApp: async () => {
    await device.reloadReactNative();
  },

  // Launch app with specific permissions
  launchAppWithPermissions: async (permissions = {}) => {
    await device.launchApp({
      permissions: {
        location: 'always',
        camera: 'YES',
        photos: 'YES',
        ...permissions
      }
    });
  },

  // Wait for network request to complete
  waitForNetwork: async (timeout = 5000) => {
    await new Promise(resolve => setTimeout(resolve, timeout));
  }
};

// Helper functions for common test scenarios
global.testHelpers = {
  // Login with test user
  loginTestUser: async (email = 'test@example.com', password = 'password123') => {
    await e2eUtils.tapElement(by.id('login-email-input'));
    await e2eUtils.clearAndType(by.id('login-email-input'), email);
    
    await e2eUtils.tapElement(by.id('login-password-input'));
    await e2eUtils.clearAndType(by.id('login-password-input'), password);
    
    await e2eUtils.tapElement(by.id('login-submit-button'));
    
    // Wait for successful login
    await waitFor(by.id('home-screen')).toBeVisible().withTimeout(10000);
  },

  // Register new test user
  registerTestUser: async (userData = {}) => {
    const defaultData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    const data = { ...defaultData, ...userData };

    await e2eUtils.tapElement(by.id('register-name-input'));
    await e2eUtils.typeText(by.id('register-name-input'), data.name);
    
    await e2eUtils.tapElement(by.id('register-email-input'));
    await e2eUtils.typeText(by.id('register-email-input'), data.email);
    
    await e2eUtils.tapElement(by.id('register-password-input'));
    await e2eUtils.typeText(by.id('register-password-input'), data.password);
    
    await e2eUtils.tapElement(by.id('register-submit-button'));
    
    // Wait for successful registration
    await waitFor(by.id('home-screen')).toBeVisible().withTimeout(10000);
    
    return data;
  },

  // Navigate to specific screen
  navigateTo: async (screenId) => {
    const navigationMap = {
      'home': by.id('tab-home'),
      'events': by.id('tab-events'),
      'profile': by.id('tab-profile'),
      'news': by.id('tab-news'),
      'achievements': by.id('tab-achievements')
    };

    if (navigationMap[screenId]) {
      await e2eUtils.tapElement(navigationMap[screenId]);
      await waitFor(by.id(`${screenId}-screen`)).toBeVisible().withTimeout(10000);
    }
  },

  // Create test event
  createTestEvent: async (eventData = {}) => {
    const defaultData = {
      title: 'Test Cricket Match',
      description: 'A friendly cricket match',
      sport: 'Cricket',
      location: 'Test Ground, Mumbai'
    };
    const data = { ...defaultData, ...eventData };

    // Navigate to create event screen
    await e2eUtils.tapElement(by.id('create-event-button'));
    await waitFor(by.id('event-form-screen')).toBeVisible().withTimeout(10000);

    // Fill event details
    await e2eUtils.clearAndType(by.id('event-title-input'), data.title);
    await e2eUtils.clearAndType(by.id('event-description-input'), data.description);
    await e2eUtils.clearAndType(by.id('event-location-input'), data.location);

    // Select sport
    await e2eUtils.tapElement(by.id('sport-picker'));
    await e2eUtils.tapElement(by.text(data.sport));

    // Submit event
    await e2eUtils.tapElement(by.id('event-submit-button'));
    
    // Wait for event creation success
    await waitFor(by.text('Event created successfully')).toBeVisible().withTimeout(10000);
    
    return data;
  },

  // Logout user
  logoutUser: async () => {
    await testHelpers.navigateTo('profile');
    await e2eUtils.tapElement(by.id('logout-button'));
    await waitFor(by.id('login-screen')).toBeVisible().withTimeout(10000);
  }
};

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for Detox
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && args[0].includes && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleError.apply(console, args);
};
