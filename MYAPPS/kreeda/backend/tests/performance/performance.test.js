const request = require('supertest');
const { performance } = require('perf_hooks');
const app = require('../../app');
const TestDatabase = require('../config/database');
const { AuthTestUtils, EventTestUtils } = require('../utils/testUtils');

describe('Performance Tests', () => {
  let testDB;
  let testUsers = [];
  let testEvents = [];
  let authTokens = [];

  beforeAll(async () => {
    testDB = new TestDatabase();
    await testDB.start();
    
    // Seed database with test data
    const seedData = await testDB.seed();
    testUsers = seedData.users;
    testEvents = seedData.events;
    
    // Generate auth tokens for performance testing
    for (const user of testUsers.slice(0, 10)) {
      authTokens.push(AuthTestUtils.generateToken(user));
    }
  });

  afterAll(async () => {
    await testDB.stop();
  });

  describe('Response Time Benchmarks', () => {
    it('should respond to GET /api/events within 100ms', async () => {
      const startTime = performance.now();
      
      const response = await request(app)
        .get('/api/events')
        .expect(200);
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`Events list response time: ${responseTime.toFixed(2)}ms`);
      expect(responseTime).toBeLessThan(100);
      expect(response.body.data.items).toBeDefined();
    });

    it('should handle user authentication within 200ms', async () => {
      const startTime = performance.now();
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers[0].email,
          password: 'password123'
        })
        .expect(200);
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`Authentication response time: ${responseTime.toFixed(2)}ms`);
      expect(responseTime).toBeLessThan(200);
      expect(response.body.data.token).toBeDefined();
    });

    it('should handle event creation within 300ms', async () => {
      const eventData = {
        title: 'Performance Test Event',
        description: 'Testing event creation performance',
        sport: 'Cricket',
        date: new Date(Date.now() + 86400000),
        startTime: '10:00',
        endTime: '12:00',
        location: {
          name: 'Test Ground',
          address: 'Test Address, Mumbai',
          latitude: 19.0760,
          longitude: 72.8777
        },
        maxParticipants: 20,
        entryFee: 0,
        difficulty: 'Beginner'
      };

      const startTime = performance.now();
      
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authTokens[0]}`)
        .send(eventData)
        .expect(201);
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`Event creation response time: ${responseTime.toFixed(2)}ms`);
      expect(responseTime).toBeLessThan(300);
      expect(response.body.data._id).toBeDefined();
    });

    it('should handle event search within 150ms', async () => {
      const startTime = performance.now();
      
      const response = await request(app)
        .get('/api/events')
        .query({
          sport: 'Cricket',
          difficulty: 'Beginner',
          location: 'Mumbai'
        })
        .expect(200);
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`Event search response time: ${responseTime.toFixed(2)}ms`);
      expect(responseTime).toBeLessThan(150);
      expect(response.body.data.items).toBeDefined();
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle 50 concurrent event list requests', async () => {
      const concurrentRequests = 50;
      const requests = [];

      const startTime = performance.now();
      
      // Create concurrent requests
      for (let i = 0; i < concurrentRequests; i++) {
        requests.push(
          request(app)
            .get('/api/events')
            .query({ page: Math.floor(i / 10) + 1, limit: 10 })
        );
      }

      // Execute all requests concurrently
      const responses = await Promise.all(requests);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`${concurrentRequests} concurrent requests completed in: ${totalTime.toFixed(2)}ms`);
      console.log(`Average response time: ${(totalTime / concurrentRequests).toFixed(2)}ms`);
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.data.items).toBeDefined();
      });
      
      // Total time should be reasonable for concurrent execution
      expect(totalTime).toBeLessThan(5000); // 5 seconds for 50 concurrent requests
    });

    it('should handle concurrent user registrations', async () => {
      const concurrentUsers = 20;
      const requests = [];

      const startTime = performance.now();
      
      // Create concurrent registration requests
      for (let i = 0; i < concurrentUsers; i++) {
        requests.push(
          request(app)
            .post('/api/auth/register')
            .send({
              name: `Concurrent User ${i}`,
              email: `concurrent${i}@performance.test`,
              password: 'password123'
            })
        );
      }

      // Execute all requests concurrently
      const responses = await Promise.all(requests);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`${concurrentUsers} concurrent registrations completed in: ${totalTime.toFixed(2)}ms`);
      
      // Count successful registrations
      const successfulRegistrations = responses.filter(r => r.status === 201).length;
      console.log(`Successful registrations: ${successfulRegistrations}/${concurrentUsers}`);
      
      expect(successfulRegistrations).toBeGreaterThan(0);
      expect(totalTime).toBeLessThan(3000); // 3 seconds for 20 concurrent registrations
    });

    it('should handle concurrent event registrations', async () => {
      const eventId = testEvents[0]._id;
      const concurrentRegistrations = 15;
      const requests = [];

      const startTime = performance.now();
      
      // Create concurrent event registration requests
      for (let i = 0; i < concurrentRegistrations; i++) {
        const tokenIndex = i % authTokens.length;
        requests.push(
          request(app)
            .post(`/api/events/${eventId}/register`)
            .set('Authorization', `Bearer ${authTokens[tokenIndex]}`)
        );
      }

      // Execute all requests concurrently
      const responses = await Promise.all(requests);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`${concurrentRegistrations} concurrent event registrations completed in: ${totalTime.toFixed(2)}ms`);
      
      // Count successful registrations (some may fail due to capacity or duplicate registrations)
      const successfulRegistrations = responses.filter(r => r.status === 200).length;
      const duplicateRegistrations = responses.filter(r => r.status === 400).length;
      
      console.log(`Successful registrations: ${successfulRegistrations}`);
      console.log(`Duplicate/Failed registrations: ${duplicateRegistrations}`);
      
      expect(successfulRegistrations + duplicateRegistrations).toBe(concurrentRegistrations);
      expect(totalTime).toBeLessThan(2000); // 2 seconds for concurrent registrations
    });
  });

  describe('Database Performance', () => {
    it('should handle pagination efficiently with large datasets', async () => {
      // Create additional events for pagination testing
      const additionalEvents = [];
      for (let i = 0; i < 50; i++) {
        const event = await EventTestUtils.createTestEvent({
          title: `Pagination Test Event ${i}`,
          sport: 'Cricket'
        }, testUsers[4]);
        additionalEvents.push(event);
      }

      // Test different page sizes
      const pageSizes = [5, 10, 20, 50];
      
      for (const pageSize of pageSizes) {
        const startTime = performance.now();
        
        const response = await request(app)
          .get('/api/events')
          .query({ page: 1, limit: pageSize })
          .expect(200);
        
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        console.log(`Pagination (limit=${pageSize}) response time: ${responseTime.toFixed(2)}ms`);
        
        expect(responseTime).toBeLessThan(200);
        expect(response.body.data.items.length).toBeLessThanOrEqual(pageSize);
        expect(response.body.data.pagination).toBeDefined();
      }
    });

    it('should handle complex event queries efficiently', async () => {
      const complexQueries = [
        {
          sport: 'Cricket',
          difficulty: 'Intermediate',
          location: 'Mumbai',
          dateFrom: '2024-01-01',
          dateTo: '2024-12-31'
        },
        {
          search: 'Cricket',
          minParticipants: 10,
          maxEntryFee: 500
        },
        {
          organizer: testUsers[4]._id.toString(),
          status: 'upcoming',
          sortBy: 'date',
          sortOrder: 'asc'
        }
      ];

      for (const query of complexQueries) {
        const startTime = performance.now();
        
        const response = await request(app)
          .get('/api/events')
          .query(query)
          .expect(200);
        
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        console.log(`Complex query response time: ${responseTime.toFixed(2)}ms`);
        console.log(`Query:`, JSON.stringify(query));
        
        expect(responseTime).toBeLessThan(300);
        expect(response.body.data.items).toBeDefined();
      }
    });
  });

  describe('Memory Usage', () => {
    it('should not have significant memory leaks during repeated requests', async () => {
      const initialMemory = process.memoryUsage();
      
      // Perform 100 requests
      for (let i = 0; i < 100; i++) {
        await request(app)
          .get('/api/events')
          .expect(200);
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      console.log(`Initial memory usage: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Final memory usage: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);
      
      // Memory increase should be reasonable (less than 50MB for 100 requests)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Stress Testing', () => {
    it('should handle rapid sequential requests', async () => {
      const rapidRequests = 200;
      const startTime = performance.now();
      
      const promises = [];
      for (let i = 0; i < rapidRequests; i++) {
        promises.push(
          request(app)
            .get('/api/events')
            .query({ page: Math.floor(i / 20) + 1 })
        );
      }
      
      const responses = await Promise.all(promises);
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      const successCount = responses.filter(r => r.status === 200).length;
      const errorCount = responses.filter(r => r.status >= 400).length;
      
      console.log(`Stress test results:`);
      console.log(`- Total requests: ${rapidRequests}`);
      console.log(`- Successful: ${successCount}`);
      console.log(`- Errors: ${errorCount}`);
      console.log(`- Total time: ${totalTime.toFixed(2)}ms`);
      console.log(`- Average response time: ${(totalTime / rapidRequests).toFixed(2)}ms`);
      console.log(`- Requests per second: ${(rapidRequests / (totalTime / 1000)).toFixed(2)}`);
      
      // Should handle at least 80% of requests successfully
      expect(successCount / rapidRequests).toBeGreaterThan(0.8);
    });

    it('should maintain performance under mixed workload', async () => {
      const mixedWorkload = [
        // Read operations (70%)
        ...Array(70).fill().map((_, i) => () => 
          request(app).get('/api/events').query({ page: (i % 5) + 1 })
        ),
        // Write operations (20%)
        ...Array(20).fill().map((_, i) => () =>
          request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${authTokens[i % authTokens.length]}`)
            .send({
              title: `Mixed Workload Event ${i}`,
              description: 'Stress testing event',
              sport: 'Cricket',
              date: new Date(Date.now() + 86400000),
              startTime: '10:00',
              endTime: '12:00',
              location: {
                name: 'Test Ground',
                address: 'Test Address, Mumbai',
                latitude: 19.0760,
                longitude: 72.8777
              },
              maxParticipants: 20,
              entryFee: 0,
              difficulty: 'Beginner'
            })
        ),
        // Authentication operations (10%)
        ...Array(10).fill().map((_, i) => () =>
          request(app)
            .post('/api/auth/login')
            .send({
              email: testUsers[i % testUsers.length].email,
              password: 'password123'
            })
        )
      ];

      // Shuffle the workload
      for (let i = mixedWorkload.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixedWorkload[i], mixedWorkload[j]] = [mixedWorkload[j], mixedWorkload[i]];
      }

      const startTime = performance.now();
      const promises = mixedWorkload.map(requestFn => requestFn());
      const responses = await Promise.all(promises);
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      const successCount = responses.filter(r => r.status < 400).length;
      const errorCount = responses.filter(r => r.status >= 400).length;

      console.log(`Mixed workload results:`);
      console.log(`- Total requests: ${mixedWorkload.length}`);
      console.log(`- Successful: ${successCount}`);
      console.log(`- Errors: ${errorCount}`);
      console.log(`- Total time: ${totalTime.toFixed(2)}ms`);
      console.log(`- Success rate: ${((successCount / mixedWorkload.length) * 100).toFixed(2)}%`);

      // Should maintain at least 85% success rate under mixed workload
      expect(successCount / mixedWorkload.length).toBeGreaterThan(0.85);
    });
  });

  describe('Performance Monitoring', () => {
    it('should track and report performance metrics', async () => {
      const metrics = {
        responseTimeSum: 0,
        requestCount: 0,
        errorCount: 0,
        slowRequests: 0
      };

      const testRequests = 50;
      
      for (let i = 0; i < testRequests; i++) {
        const startTime = performance.now();
        
        try {
          const response = await request(app)
            .get('/api/events')
            .query({ page: (i % 5) + 1 });
          
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          metrics.responseTimeSum += responseTime;
          metrics.requestCount++;
          
          if (response.status >= 400) {
            metrics.errorCount++;
          }
          
          if (responseTime > 500) {
            metrics.slowRequests++;
          }
          
        } catch (error) {
          metrics.errorCount++;
        }
      }

      const avgResponseTime = metrics.responseTimeSum / metrics.requestCount;
      const errorRate = (metrics.errorCount / testRequests) * 100;
      const slowRequestRate = (metrics.slowRequests / testRequests) * 100;

      console.log(`Performance Metrics:`);
      console.log(`- Average response time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`- Error rate: ${errorRate.toFixed(2)}%`);
      console.log(`- Slow requests (>500ms): ${slowRequestRate.toFixed(2)}%`);
      console.log(`- Total requests: ${testRequests}`);

      // Performance assertions
      expect(avgResponseTime).toBeLessThan(200);
      expect(errorRate).toBeLessThan(5);
      expect(slowRequestRate).toBeLessThan(10);
    });
  });
});

describe('Load Testing Scenarios', () => {
  let testDB;

  beforeAll(async () => {
    testDB = new TestDatabase();
    await testDB.start();
    await testDB.seed();
  });

  afterAll(async () => {
    await testDB.stop();
  });

  it('should simulate realistic user behavior patterns', async () => {
    const userSessions = [
      // Browse events
      async () => {
        await request(app).get('/api/events');
        await request(app).get('/api/events').query({ sport: 'Cricket' });
        await request(app).get('/api/events').query({ difficulty: 'Beginner' });
      },
      
      // User registration and login flow
      async () => {
        const userData = {
          name: 'Realistic User',
          email: `realistic${Date.now()}@test.com`,
          password: 'password123'
        };
        
        await request(app).post('/api/auth/register').send(userData);
        await request(app).post('/api/auth/login').send({
          email: userData.email,
          password: userData.password
        });
      },
      
      // Event interaction flow
      async () => {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'organizer@test.com',
            password: 'password123'
          });
        
        const token = loginResponse.body.data?.token;
        if (token) {
          await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);
          
          await request(app).get('/api/events');
        }
      }
    ];

    const startTime = performance.now();
    
    // Execute user sessions concurrently
    await Promise.all(userSessions.map(session => session()));
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    console.log(`Realistic user simulation completed in: ${totalTime.toFixed(2)}ms`);
    
    // Should complete within reasonable time
    expect(totalTime).toBeLessThan(3000);
  });
});
