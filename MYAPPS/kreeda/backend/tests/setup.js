const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Increase test timeout
jest.setTimeout(30000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only';
process.env.JWT_EXPIRES_IN = '1h';

let mongod;

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up database between tests
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

// Global test utilities
global.testUtils = {
  // Wait for async operations
  waitFor: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Generate test user data
  generateUserData: () => ({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  }),
  
  // Generate test event data
  generateEventData: () => ({
    title: 'Test Event',
    description: 'This is a test event for testing purposes',
    sport: 'Cricket',
    date: new Date(Date.now() + 86400000), // Tomorrow
    startTime: '10:00',
    endTime: '12:00',
    location: {
      name: 'Test Ground',
      address: 'Test Address, Mumbai',
      latitude: 19.0760,
      longitude: 72.8777
    },
    maxParticipants: 20,
    entryFee: 100,
    difficulty: 'Beginner',
    requirements: ['Age 18+ years'],
    prizes: ['Trophy for winner'],
    isPublic: true,
    allowSpectators: true,
    provideEquipment: false
  })
};

// Console error suppression for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
