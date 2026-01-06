# Testing Documentation - Kreeda Sports App

This document provides comprehensive information about the testing strategy, setup, and execution for the Kreeda Sports App project.

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Test Infrastructure](#test-infrastructure)
- [Backend Testing](#backend-testing)
- [Frontend Testing](#frontend-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance Testing](#performance-testing)
- [Test Execution](#test-execution)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Testing Strategy

### Testing Pyramid

Our testing strategy follows the testing pyramid approach:

```
           E2E Tests (10%)
       ┌─────────────────────┐
       │  User Interface     │
       │  Full Workflows     │
       └─────────────────────┘
     Integration Tests (20%)
   ┌─────────────────────────────┐
   │  API Endpoints              │
   │  Database Operations        │
   │  Component Integration      │
   └─────────────────────────────┘
        Unit Tests (70%)
┌───────────────────────────────────┐
│  Functions, Classes, Components   │
│  Business Logic                   │
│  Utilities                        │
└───────────────────────────────────┘
```

### Test Types

1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test API endpoints and component interactions
3. **End-to-End Tests** - Test complete user workflows
4. **Performance Tests** - Test system performance under load
5. **Security Tests** - Test authentication and authorization

## Test Infrastructure

### Backend Testing Stack

- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **MongoDB Memory Server** - In-memory database for testing
- **Artillery** - Load testing framework

### Frontend Testing Stack

- **Jest** - Testing framework
- **React Native Testing Library** - Component testing utilities
- **Detox** - End-to-end testing framework
- **Metro** - JavaScript bundler with testing support

### Test Database

- In-memory MongoDB for isolated testing
- Seeded with realistic test data
- Automatic cleanup between tests

## Backend Testing

### Test Structure

```
backend/tests/
├── setup.js                 # Global test setup
├── utils/
│   └── testUtils.js         # Test utilities and helpers
├── api/
│   ├── auth.test.js         # Authentication API tests
│   └── events.test.js       # Events API tests
├── config/
│   └── database.js          # Test database configuration
└── performance/
    ├── load-test.yml        # Artillery load test configuration
    ├── test-data.csv        # Test data for load testing
    └── performance.test.js   # Performance benchmarks
```

### API Test Coverage

#### Authentication Tests
- User registration with validation
- User login with credentials
- JWT token handling
- Password security (hashing, validation)
- Session management
- Error handling and edge cases

#### Events Tests
- CRUD operations (Create, Read, Update, Delete)
- Event filtering and search
- Pagination
- Event registration/unregistration
- Permission and authorization checks
- Concurrent operations handling

### Running Backend Tests

```bash
# Run all tests
npm test

# Run specific test files
npm test -- auth.test.js
npm test -- events.test.js

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run performance tests
npm run test:performance
```

## Frontend Testing

### Test Structure

```
frontend/__tests__/
├── setup.js                 # Test setup and mocking
├── utils/
│   └── testUtils.js         # Frontend test utilities
└── components/
    ├── Auth.test.js         # Authentication components
    ├── Events.test.js       # Event components
    └── Profile.test.js      # Profile components
```

### Component Test Coverage

- Screen rendering and navigation
- Form validation and submission
- User interactions (taps, swipes, input)
- State management
- API integration
- Error handling

### Running Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## End-to-End Testing

### Detox Setup

E2E tests simulate real user interactions on physical devices or emulators.

### Test Scenarios

#### Authentication Flow
- User registration with validation
- Login/logout functionality
- Session persistence
- Password visibility toggle
- Error handling

#### Event Management Flow
- Browse and search events
- Event creation with form validation
- Event registration/unregistration
- Event editing and management
- Map integration and location services

#### User Profile Flow
- Profile viewing and editing
- Avatar upload
- Sports interests selection
- Achievement tracking

### Running E2E Tests

```bash
# Build the app for testing
npm run build:e2e

# Run E2E tests on iOS simulator
npm run e2e:ios

# Run E2E tests on Android emulator
npm run e2e:android

# Run specific E2E test
npm run e2e -- --testNamePattern="Authentication"
```

## Performance Testing

### Load Testing with Artillery

Artillery configuration tests various load scenarios:

- **Warm-up phase** - 5 requests/second for 60 seconds
- **Ramp-up phase** - 10-50 requests/second for 120 seconds
- **Sustained load** - 50 requests/second for 300 seconds
- **Peak load** - 50-100 requests/second for 120 seconds
- **Cool-down phase** - 100-5 requests/second for 60 seconds

### Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Response Time (P95) | < 1000ms | 95% of requests |
| Response Time (P99) | < 2000ms | 99% of requests |
| Request Rate | > 45 req/s | Sustained throughput |
| Success Rate | > 95% | HTTP 2xx responses |
| Error Rate | < 5% | HTTP 4xx/5xx responses |

### Running Performance Tests

```bash
# Run performance benchmarks
npm run test:performance

# Run load tests with Artillery
npm run load-test

# Run load test with custom configuration
artillery run backend/tests/performance/load-test.yml

# Generate performance report
artillery run --output report.json backend/tests/performance/load-test.yml
artillery report report.json
```

## Test Execution

### Local Development

```bash
# Run all tests
npm run test:all

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (development)
npm run test:watch

# Run linting and tests
npm run test:ci
```

### Test Scripts Overview

| Script | Description |
|--------|-------------|
| `test` | Run unit and integration tests |
| `test:watch` | Run tests in watch mode |
| `test:coverage` | Generate coverage reports |
| `test:unit` | Run unit tests only |
| `test:integration` | Run integration tests only |
| `test:e2e` | Run end-to-end tests |
| `test:performance` | Run performance tests |
| `test:ci` | Run all tests for CI/CD |

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:backend
      - run: npm run test:performance

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:frontend

  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run e2e:ios
```

### Quality Gates

Tests must pass the following quality gates:

- **Unit Tests** - 90% pass rate
- **Integration Tests** - 95% pass rate
- **Code Coverage** - Minimum 80% line coverage
- **Performance Tests** - Response time < 1000ms (P95)
- **E2E Tests** - Critical user paths must pass

## Test Data Management

### Test Database Seeding

The test database is automatically seeded with:

- 5 test users with different profiles
- 5 test events across various sports
- User-event relationships (registrations)
- Realistic location data for Mumbai

### Test Data Scenarios

- **Full Events** - Events at maximum capacity
- **Past Events** - Completed events for testing history
- **Private Events** - Non-public events for access testing

## Best Practices

### Writing Tests

1. **Follow AAA Pattern** - Arrange, Act, Assert
2. **Use Descriptive Names** - Tests should read like specifications
3. **Test One Thing** - Each test should verify one behavior
4. **Use Test Data Builders** - Create consistent test data
5. **Mock External Dependencies** - Keep tests isolated and fast

### Test Maintenance

1. **Keep Tests Fast** - Unit tests should run in milliseconds
2. **Clean Up Resources** - Properly tear down test data
3. **Update Tests with Code** - Tests are first-class citizens
4. **Review Test Coverage** - Aim for meaningful coverage
5. **Monitor Test Performance** - Remove slow or flaky tests

### Example Test Structure

```javascript
describe('Event Registration API', () => {
  beforeEach(async () => {
    // Arrange - Set up test data
    testUser = await AuthTestUtils.createTestUser();
    testEvent = await EventTestUtils.createTestEvent();
  });

  it('should allow user to register for an event', async () => {
    // Act - Perform the action
    const response = await request(app)
      .post(`/api/events/${testEvent._id}/register`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    // Assert - Verify the outcome
    expect(response.body.data.registered).toBe(true);
    
    // Verify database state
    const updatedEvent = await Event.findById(testEvent._id);
    expect(updatedEvent.participants).toContain(testUser._id);
  });
});
```

## Troubleshooting

### Common Issues

1. **Tests Timeout** - Increase Jest timeout or check for async issues
2. **Database Connection** - Ensure MongoDB Memory Server starts properly
3. **Mock Issues** - Verify all external dependencies are mocked
4. **Port Conflicts** - Use different ports for test environment
5. **Memory Leaks** - Clean up test data and close connections

### Debug Mode

```bash
# Run tests with debug output
DEBUG=* npm test

# Run single test file with verbose output
npm test -- --verbose auth.test.js

# Run tests with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report** - `coverage/lcov-report/index.html`
- **JSON Report** - `coverage/coverage-final.json`
- **LCOV Report** - `coverage/lcov.info`

View the HTML report to see detailed coverage information by file and line.

## Performance Monitoring

Performance metrics are tracked for:

- **Response Times** - API endpoint performance
- **Throughput** - Requests per second
- **Error Rates** - Failed request percentages
- **Resource Usage** - Memory and CPU consumption
- **Database Performance** - Query execution times

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add appropriate test coverage
4. Update documentation if needed
5. Run performance tests for API changes

For questions or issues with testing, please refer to the project's GitHub issues or contact the development team.
