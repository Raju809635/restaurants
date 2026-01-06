const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');

/**
 * Test utilities for authentication and user management
 */
class AuthTestUtils {
  /**
   * Create a test user in the database
   * @param {Object} userData - User data override
   * @returns {Promise<Object>} Created user object
   */
  static async createTestUser(userData = {}) {
    const defaultUserData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phoneNumber: '+919876543210',
      age: 25,
      gender: 'Male',
      location: 'Mumbai, India',
      sportsInterests: ['Cricket', 'Football']
    };

    const user = new User({ ...defaultUserData, ...userData });
    await user.save();
    return user;
  }

  /**
   * Create multiple test users
   * @param {number} count - Number of users to create
   * @param {Object} baseData - Base user data
   * @returns {Promise<Array>} Array of created users
   */
  static async createMultipleUsers(count = 3, baseData = {}) {
    const users = [];
    for (let i = 0; i < count; i++) {
      const userData = {
        ...baseData,
        email: `test${Date.now()}_${i}@example.com`,
        name: `Test User ${i + 1}`
      };
      const user = await this.createTestUser(userData);
      users.push(user);
    }
    return users;
  }

  /**
   * Generate JWT token for a user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  static generateToken(user) {
    return jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  /**
   * Create authorization header for API requests
   * @param {Object} user - User object
   * @returns {Object} Headers object with authorization
   */
  static getAuthHeaders(user) {
    const token = this.generateToken(user);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Hash a password for testing
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }
}

/**
 * Test utilities for events management
 */
class EventTestUtils {
  /**
   * Create a test event in the database
   * @param {Object} eventData - Event data override
   * @param {Object} organizer - User object who organizes the event
   * @returns {Promise<Object>} Created event object
   */
  static async createTestEvent(eventData = {}, organizer = null) {
    if (!organizer) {
      organizer = await AuthTestUtils.createTestUser();
    }

    const defaultEventData = {
      title: 'Test Cricket Match',
      description: 'A friendly cricket match for testing purposes',
      sport: 'Cricket',
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: '10:00',
      endTime: '12:00',
      location: {
        name: 'Test Cricket Ground',
        address: 'Test Address, Mumbai, Maharashtra',
        latitude: 19.0760,
        longitude: 72.8777
      },
      organizer: organizer._id,
      maxParticipants: 22,
      entryFee: 100,
      difficulty: 'Beginner',
      requirements: ['Age 18+ years', 'Basic cricket knowledge'],
      prizes: ['Trophy for winning team', 'Certificates for all'],
      isPublic: true,
      allowSpectators: true,
      provideEquipment: false,
      tags: ['friendly', 'weekend', 'outdoor']
    };

    const event = new Event({ ...defaultEventData, ...eventData });
    await event.save();
    return event;
  }

  /**
   * Create multiple test events
   * @param {number} count - Number of events to create
   * @param {Object} baseData - Base event data
   * @param {Object} organizer - Event organizer
   * @returns {Promise<Array>} Array of created events
   */
  static async createMultipleEvents(count = 3, baseData = {}, organizer = null) {
    if (!organizer) {
      organizer = await AuthTestUtils.createTestUser();
    }

    const events = [];
    const sports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton'];
    
    for (let i = 0; i < count; i++) {
      const eventData = {
        ...baseData,
        title: `Test Event ${i + 1}`,
        sport: sports[i % sports.length],
        date: new Date(Date.now() + (86400000 * (i + 1))) // i+1 days from now
      };
      const event = await this.createTestEvent(eventData, organizer);
      events.push(event);
    }
    return events;
  }

  /**
   * Register a user for an event
   * @param {Object} event - Event object
   * @param {Object} user - User object
   * @returns {Promise<Object>} Updated event object
   */
  static async registerUserForEvent(event, user) {
    event.participants.push(user._id);
    await event.save();
    
    user.registeredEvents.push(event._id);
    await user.save();
    
    return event;
  }
}

/**
 * API response validation utilities
 */
class ResponseTestUtils {
  /**
   * Validate success response structure
   * @param {Object} response - API response object
   * @param {number} expectedStatus - Expected HTTP status code
   */
  static validateSuccessResponse(response, expectedStatus = 200) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
  }

  /**
   * Validate error response structure
   * @param {Object} response - API response object
   * @param {number} expectedStatus - Expected HTTP status code
   * @param {string} expectedMessage - Expected error message (optional)
   */
  static validateErrorResponse(response, expectedStatus, expectedMessage = null) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    
    if (expectedMessage) {
      expect(response.body.message).toBe(expectedMessage);
    }
  }

  /**
   * Validate pagination response structure
   * @param {Object} response - API response object
   */
  static validatePaginationResponse(response) {
    this.validateSuccessResponse(response);
    expect(response.body.data).toHaveProperty('items');
    expect(response.body.data).toHaveProperty('pagination');
    expect(response.body.data.pagination).toHaveProperty('currentPage');
    expect(response.body.data.pagination).toHaveProperty('totalPages');
    expect(response.body.data.pagination).toHaveProperty('totalCount');
    expect(response.body.data.pagination).toHaveProperty('hasNext');
    expect(response.body.data.pagination).toHaveProperty('hasPrev');
  }

  /**
   * Validate user object structure
   * @param {Object} user - User object to validate
   * @param {boolean} includePrivate - Whether to include private fields
   */
  static validateUserObject(user, includePrivate = false) {
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('level');
    expect(user).toHaveProperty('xp');
    expect(user).toHaveProperty('sportsInterests');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');

    if (!includePrivate) {
      expect(user).not.toHaveProperty('password');
      expect(user).not.toHaveProperty('refreshToken');
    }
  }

  /**
   * Validate event object structure
   * @param {Object} event - Event object to validate
   */
  static validateEventObject(event) {
    expect(event).toHaveProperty('_id');
    expect(event).toHaveProperty('title');
    expect(event).toHaveProperty('description');
    expect(event).toHaveProperty('sport');
    expect(event).toHaveProperty('date');
    expect(event).toHaveProperty('startTime');
    expect(event).toHaveProperty('endTime');
    expect(event).toHaveProperty('location');
    expect(event).toHaveProperty('organizer');
    expect(event).toHaveProperty('participants');
    expect(event).toHaveProperty('maxParticipants');
    expect(event).toHaveProperty('status');
    expect(event).toHaveProperty('createdAt');
    expect(event).toHaveProperty('updatedAt');
  }
}

/**
 * Database cleanup utilities
 */
class CleanupTestUtils {
  /**
   * Clear all test data from database
   */
  static async clearAllData() {
    await User.deleteMany({});
    await Event.deleteMany({});
  }

  /**
   * Clear specific collections
   * @param {Array<string>} collections - Collection names to clear
   */
  static async clearCollections(collections = ['users', 'events']) {
    const models = {
      users: User,
      events: Event
    };

    for (const collection of collections) {
      if (models[collection]) {
        await models[collection].deleteMany({});
      }
    }
  }

  /**
   * Reset database sequences/counters
   */
  static async resetSequences() {
    // Add any sequence reset logic if needed
  }
}

/**
 * Mock data generators
 */
class MockDataUtils {
  /**
   * Generate random user data
   * @param {Object} overrides - Data to override
   * @returns {Object} Generated user data
   */
  static generateRandomUser(overrides = {}) {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anita', 'Rahul', 'Deepika'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Nair', 'Joshi'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Date.now()}@example.com`,
      password: 'password123',
      phoneNumber: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      age: Math.floor(Math.random() * 40) + 18,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      location: `${city}, India`,
      sportsInterests: this.getRandomSports(),
      ...overrides
    };
  }

  /**
   * Get random sports array
   * @param {number} count - Number of sports to return
   * @returns {Array<string>} Array of sports
   */
  static getRandomSports(count = 2) {
    const allSports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Volleyball', 'Hockey', 'Swimming'];
    const shuffled = allSports.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Generate random event data
   * @param {Object} organizer - Event organizer
   * @param {Object} overrides - Data to override
   * @returns {Object} Generated event data
   */
  static generateRandomEvent(organizer, overrides = {}) {
    const sports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
    const venues = ['Sports Complex', 'Ground', 'Stadium', 'Club', 'Park'];
    
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const venue = venues[Math.floor(Math.random() * venues.length)];
    
    return {
      title: `${sport} ${venue} Match`,
      description: `Join us for an exciting ${sport.toLowerCase()} match at ${venue}`,
      sport,
      date: new Date(Date.now() + Math.floor(Math.random() * 30) * 86400000), // Random date in next 30 days
      startTime: `${Math.floor(Math.random() * 12) + 6}:00`, // Between 6:00 and 17:00
      endTime: `${Math.floor(Math.random() * 12) + 8}:00`, // Between 8:00 and 19:00
      location: {
        name: `${venue} ${Math.floor(Math.random() * 10) + 1}`,
        address: `Test Address, Mumbai, Maharashtra`,
        latitude: 19.0760 + (Math.random() - 0.5) * 0.1,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.1
      },
      organizer: organizer._id,
      maxParticipants: Math.floor(Math.random() * 20) + 10,
      entryFee: Math.floor(Math.random() * 500) * 10, // Random fee in multiples of 10
      difficulty,
      isPublic: Math.random() > 0.3,
      allowSpectators: Math.random() > 0.5,
      provideEquipment: Math.random() > 0.5,
      ...overrides
    };
  }
}

module.exports = {
  AuthTestUtils,
  EventTestUtils,
  ResponseTestUtils,
  CleanupTestUtils,
  MockDataUtils
};
