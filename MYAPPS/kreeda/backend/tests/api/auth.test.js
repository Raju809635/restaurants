const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const User = require('../../models/User');
const { AuthTestUtils, ResponseTestUtils } = require('../utils/testUtils');

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = testUtils.generateUserData();
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      ResponseTestUtils.validateSuccessResponse(response, 201);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      
      ResponseTestUtils.validateUserObject(response.body.data.user);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      
      // Verify user was saved to database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.name).toBe(userData.name);
      
      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare(userData.password, savedUser.password);
      expect(isPasswordValid).toBe(true);
    });

    it('should not register user with existing email', async () => {
      const userData = testUtils.generateUserData();
      await AuthTestUtils.createTestUser({ email: userData.email });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const testCases = [
        { field: 'name', data: { email: 'test@example.com', password: 'password123' } },
        { field: 'email', data: { name: 'Test User', password: 'password123' } },
        { field: 'password', data: { name: 'Test User', email: 'test@example.com' } },
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/auth/register')
          .send(testCase.data);

        ResponseTestUtils.validateErrorResponse(response, 400);
        expect(response.body.message).toContain(testCase.field);
      }
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('email');
    });

    it('should validate password strength', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123' // Too short
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('password');
    });

    it('should set default user values', async () => {
      const userData = testUtils.generateUserData();
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      ResponseTestUtils.validateSuccessResponse(response, 201);
      
      const user = response.body.data.user;
      expect(user.level).toBe(1);
      expect(user.xp).toBe(0);
      expect(user.sportsInterests).toEqual([]);
      expect(user.achievements).toEqual([]);
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser;
    const testPassword = 'password123';

    beforeEach(async () => {
      testUser = await AuthTestUtils.createTestUser({ password: testPassword });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testPassword
        });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      
      ResponseTestUtils.validateUserObject(response.body.data.user);
      expect(response.body.data.user.email).toBe(testUser.email);
      
      // Verify token is valid JWT
      const decoded = jwt.verify(response.body.data.token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(testUser._id.toString());
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testPassword
        });

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should require email and password', async () => {
      const testCases = [
        { field: 'email', data: { password: testPassword } },
        { field: 'password', data: { email: testUser.email } },
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(testCase.data);

        ResponseTestUtils.validateErrorResponse(response, 400);
        expect(response.body.message).toContain(testCase.field);
      }
    });

    it('should handle case insensitive email login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email.toUpperCase(),
          password: testPassword
        });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.data.user.email).toBe(testUser.email);
    });
  });

  describe('GET /api/auth/me', () => {
    let testUser;
    let authHeaders;

    beforeEach(async () => {
      testUser = await AuthTestUtils.createTestUser();
      authHeaders = AuthTestUtils.getAuthHeaders(testUser);
    });

    it('should get current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set(authHeaders);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      ResponseTestUtils.validateUserObject(response.body.data);
      expect(response.body.data._id).toBe(testUser._id.toString());
      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('token');
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should not get profile with expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: testUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('expired');
    });

    it('should handle user not found in token', async () => {
      // Create token with non-existent user ID
      const fakeUserId = '507f1f77bcf86cd799439011';
      const fakeToken = jwt.sign(
        { userId: fakeUserId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${fakeToken}`);

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('User not found');
    });
  });

  describe('POST /api/auth/logout', () => {
    let testUser;
    let authHeaders;

    beforeEach(async () => {
      testUser = await AuthTestUtils.createTestUser();
      authHeaders = AuthTestUtils.getAuthHeaders(testUser);
    });

    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set(authHeaders);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.message).toContain('Logged out successfully');
    });

    it('should not logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('token');
    });
  });

  describe('Password Security', () => {
    it('should hash passwords with bcrypt', async () => {
      const userData = testUtils.generateUserData();
      
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const savedUser = await User.findOne({ email: userData.email });
      
      // Password should be hashed
      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash format
      
      // Original password should verify against hash
      const isValid = await bcrypt.compare(userData.password, savedUser.password);
      expect(isValid).toBe(true);
    });

    it('should not store plain text passwords', async () => {
      const userData = testUtils.generateUserData();
      
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const savedUser = await User.findOne({ email: userData.email }).select('+password');
      expect(savedUser.password).not.toContain(userData.password);
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple rapid requests gracefully', async () => {
      const userData = testUtils.generateUserData();
      
      // Make multiple concurrent registration requests
      const promises = Array(5).fill().map(() => 
        request(app)
          .post('/api/auth/register')
          .send({
            ...userData,
            email: `${Date.now()}_${Math.random()}@example.com`
          })
      );

      const responses = await Promise.all(promises);
      
      // All should complete successfully
      responses.forEach(response => {
        expect(response.status).toBeLessThan(500);
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize user input', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(maliciousData);

      if (response.status === 201) {
        const user = response.body.data.user;
        expect(user.name).not.toContain('<script>');
        expect(user.name).not.toContain('alert');
      }
    });

    it('should reject SQL injection attempts', async () => {
      const sqlInjection = {
        name: "'; DROP TABLE users; --",
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(sqlInjection);

      // Should either reject or sanitize the input
      expect(response.status).toBeLessThan(500);
      
      if (response.status === 201) {
        const user = response.body.data.user;
        expect(user.name).not.toContain('DROP TABLE');
      }
    });
  });
});
