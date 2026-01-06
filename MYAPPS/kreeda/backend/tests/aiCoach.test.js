const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const {
  PersonalizedPlan,
  PerformanceMetric,
  CoachingSession,
  AIInsight
} = require('../models/AICoach');
const jwt = require('jsonwebtoken');

describe('AI Coach API', () => {
  let authToken;
  let testUser;
  let testPlan;

  beforeAll(async () => {
    // Connect to test database
    const testDbUrl = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/kreeda_test';
    await mongoose.connect(testDbUrl);
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear all test data
    await User.deleteMany({});
    await PersonalizedPlan.deleteMany({});
    await PerformanceMetric.deleteMany({});
    await CoachingSession.deleteMany({});
    await AIInsight.deleteMany({});

    // Create test user and token
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      level: 15
    });
    await testUser.save();

    authToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET || 'secret');
  });

  describe('POST /api/ai-coach/plans', () => {
    test('should create a personalized training plan', async () => {
      const planData = {
        sport: 'Cricket',
        goals: ['technique', 'fitness'],
        duration: 8,
        difficulty: 'Intermediate'
      };

      const response = await request(app)
        .post('/api/ai-coach/plans')
        .set('Authorization', `Bearer ${authToken}`)
        .send(planData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.workoutPlan.sport).toBe('Cricket');
      expect(response.body.data.workoutPlan.goals).toEqual(['technique', 'fitness']);
      expect(response.body.data.progress.totalWorkouts).toBeGreaterThan(0);
    });

    test('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/ai-coach/plans')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sport: 'Cricket' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('goals');
    });

    test('should return 401 without auth token', async () => {
      await request(app)
        .post('/api/ai-coach/plans')
        .send({ sport: 'Cricket', goals: ['fitness'] })
        .expect(401);
    });
  });

  describe('GET /api/ai-coach/plans/current', () => {
    beforeEach(async () => {
      // Create a test plan
      testPlan = new PersonalizedPlan({
        user: testUser._id,
        workoutPlan: {
          name: 'Test Cricket Plan',
          sport: 'Cricket',
          difficulty: 'Beginner',
          duration: 4,
          frequency: 3,
          exercises: [],
          goals: ['fitness']
        },
        progress: {
          totalWorkouts: 12,
          completedWorkouts: 5,
          percentage: 41.67
        }
      });
      await testPlan.save();
    });

    test('should get current active plan', async () => {
      const response = await request(app)
        .get('/api/ai-coach/plans/current')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.workoutPlan.name).toBe('Test Cricket Plan');
    });

    test('should return 404 if no active plan', async () => {
      // Mark plan as completed
      testPlan.status = 'completed';
      await testPlan.save();

      const response = await request(app)
        .get('/api/ai-coach/plans/current')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/ai-coach/plans/:planId/progress', () => {
    beforeEach(async () => {
      testPlan = new PersonalizedPlan({
        user: testUser._id,
        workoutPlan: {
          name: 'Test Plan',
          sport: 'Football',
          difficulty: 'Beginner',
          duration: 4,
          frequency: 3,
          exercises: [],
          goals: ['fitness']
        },
        progress: {
          totalWorkouts: 12,
          completedWorkouts: 5,
          percentage: 41.67
        }
      });
      await testPlan.save();
    });

    test('should update plan progress', async () => {
      const updateData = {
        workoutCompleted: true,
        performanceData: {
          metrics: {
            endurance: 75,
            strength: 80,
            technique: 70
          },
          overallScore: 75,
          notes: 'Good session today'
        }
      };

      const response = await request(app)
        .put(`/api/ai-coach/plans/${testPlan._id}/progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.progress.completedWorkouts).toBe(6);
      expect(response.body.data.progress.percentage).toBeCloseTo(50);

      // Check if performance metric was created
      const metrics = await PerformanceMetric.find({ user: testUser._id });
      expect(metrics).toHaveLength(1);
      expect(metrics[0].overallScore).toBe(75);
    });

    test('should mark plan as completed when all workouts done', async () => {
      // Set progress to almost complete
      testPlan.progress.completedWorkouts = 11;
      await testPlan.save();

      const response = await request(app)
        .put(`/api/ai-coach/plans/${testPlan._id}/progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ workoutCompleted: true })
        .expect(200);

      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.completedAt).toBeDefined();
    });
  });

  describe('POST /api/ai-coach/chat', () => {
    test('should start a coaching chat session', async () => {
      const chatData = {
        message: 'I need help with my training plan',
        sessionType: 'chat',
        sport: 'Cricket'
      };

      const response = await request(app)
        .post('/api/ai-coach/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBeDefined();
      expect(response.body.data.sessionId).toBeDefined();
      expect(response.body.data.coachPersonality).toBeDefined();
    });

    test('should handle motivation requests', async () => {
      const chatData = {
        message: 'I need some motivation to continue training',
        sessionType: 'chat'
      };

      const response = await request(app)
        .post('/api/ai-coach/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatData)
        .expect(200);

      expect(response.body.data.message).toContain('You');
      expect(response.body.data.coachPersonality).toBeDefined();
    });

    test('should return 400 without message', async () => {
      const response = await request(app)
        .post('/api/ai-coach/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sessionType: 'chat' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/ai-coach/metrics', () => {
    test('should add performance metrics', async () => {
      const metricsData = {
        sport: 'Tennis',
        metrics: {
          endurance: 85,
          strength: 70,
          speed: 75,
          agility: 80,
          technique: 90,
          mental: 85
        },
        overallScore: 80,
        notes: 'Great improvement in technique'
      };

      const response = await request(app)
        .post('/api/ai-coach/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send(metricsData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sport).toBe('Tennis');
      expect(response.body.data.overallScore).toBe(80);
    });

    test('should return 400 if required fields missing', async () => {
      const response = await request(app)
        .post('/api/ai-coach/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sport: 'Tennis' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('metrics');
    });
  });

  describe('POST /api/ai-coach/analyze', () => {
    beforeEach(async () => {
      // Create some performance metrics for analysis
      const metrics1 = new PerformanceMetric({
        user: testUser._id,
        sport: 'Cricket',
        metrics: {
          endurance: 70,
          strength: 65,
          technique: 75
        },
        overallScore: 70
      });

      const metrics2 = new PerformanceMetric({
        user: testUser._id,
        sport: 'Cricket',
        metrics: {
          endurance: 75,
          strength: 70,
          technique: 80
        },
        overallScore: 75,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
      });

      await Promise.all([metrics1.save(), metrics2.save()]);
    });

    test('should analyze performance and provide insights', async () => {
      const response = await request(app)
        .post('/api/ai-coach/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sport: 'Cricket' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.improvements).toBeDefined();
      expect(response.body.data.recommendations).toBeDefined();
      expect(Array.isArray(response.body.data.recommendations)).toBe(true);
    });

    test('should handle insufficient data', async () => {
      // Clear metrics
      await PerformanceMetric.deleteMany({});

      const response = await request(app)
        .post('/api/ai-coach/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sport: 'Basketball' })
        .expect(200);

      expect(response.body.data.message).toContain('Need more data');
    });
  });

  describe('GET /api/ai-coach/insights', () => {
    beforeEach(async () => {
      // Create test insights
      const insight1 = new AIInsight({
        user: testUser._id,
        type: 'goal_progress',
        title: 'Great Progress!',
        description: 'You are making excellent progress',
        sport: 'Cricket',
        priority: 'high',
        viewed: false
      });

      const insight2 = new AIInsight({
        user: testUser._id,
        type: 'performance_trend',
        title: 'Technique Improvement',
        description: 'Your technique has improved significantly',
        sport: 'Cricket',
        priority: 'medium',
        viewed: true
      });

      await Promise.all([insight1.save(), insight2.save()]);
    });

    test('should get user insights with pagination', async () => {
      const response = await request(app)
        .get('/api/ai-coach/insights?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(2);
    });

    test('should filter insights by type', async () => {
      const response = await request(app)
        .get('/api/ai-coach/insights?type=goal_progress')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].type).toBe('goal_progress');
    });
  });

  describe('GET /api/ai-coach/dashboard', () => {
    beforeEach(async () => {
      // Create test data for dashboard
      testPlan = new PersonalizedPlan({
        user: testUser._id,
        workoutPlan: {
          name: 'Dashboard Test Plan',
          sport: 'Football',
          difficulty: 'Intermediate',
          duration: 6,
          frequency: 4,
          exercises: [],
          goals: ['fitness', 'technique']
        },
        progress: {
          totalWorkouts: 24,
          completedWorkouts: 10,
          percentage: 41.67
        }
      });

      const insight = new AIInsight({
        user: testUser._id,
        type: 'goal_progress',
        title: 'Weekly Progress',
        description: 'You completed 3 workouts this week',
        sport: 'Football',
        priority: 'medium',
        viewed: false
      });

      const metric = new PerformanceMetric({
        user: testUser._id,
        sport: 'Football',
        metrics: { endurance: 80, strength: 75 },
        overallScore: 78
      });

      await Promise.all([testPlan.save(), insight.save(), metric.save()]);
    });

    test('should get comprehensive dashboard data', async () => {
      const response = await request(app)
        .get('/api/ai-coach/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      const dashboard = response.body.data;
      expect(dashboard.activePlan).toBeDefined();
      expect(dashboard.activePlan.name).toBe('Dashboard Test Plan');
      expect(dashboard.recentInsights).toHaveLength(1);
      expect(dashboard.latestPerformance).toBeDefined();
      expect(dashboard.weeklyStats).toBeDefined();
    });
  });

  describe('GET /api/ai-coach/exercises', () => {
    test('should get all available exercises', async () => {
      const response = await request(app)
        .get('/api/ai-coach/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should filter exercises by sport', async () => {
      const response = await request(app)
        .get('/api/ai-coach/exercises?sport=Cricket')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.every(ex => ex.sport === 'Cricket')).toBe(true);
    });

    test('should filter exercises by difficulty', async () => {
      const response = await request(app)
        .get('/api/ai-coach/exercises?difficulty=Beginner')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.every(ex => ex.difficulty === 'Beginner')).toBe(true);
    });
  });

  describe('GET /api/ai-coach/reports/weekly', () => {
    beforeEach(async () => {
      // Create test data for weekly report
      testPlan = new PersonalizedPlan({
        user: testUser._id,
        workoutPlan: {
          name: 'Weekly Report Plan',
          sport: 'Tennis',
          difficulty: 'Intermediate',
          duration: 8,
          frequency: 3,
          exercises: [],
          goals: ['technique']
        },
        progress: {
          totalWorkouts: 24,
          completedWorkouts: 20,
          percentage: 83.33
        }
      });

      const recentMetric = new PerformanceMetric({
        user: testUser._id,
        sport: 'Tennis',
        metrics: {
          endurance: 85,
          strength: 75,
          technique: 90,
          speed: 80
        },
        overallScore: 82,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      });

      await Promise.all([testPlan.save(), recentMetric.save()]);
    });

    test('should generate weekly performance report', async () => {
      const response = await request(app)
        .get('/api/ai-coach/reports/weekly')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      const report = response.body.data;
      expect(report.weekPeriod).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.achievements).toBeInstanceOf(Array);
      expect(report.nextWeekRecommendations).toBeInstanceOf(Array);
      
      // Should have plan progress info
      expect(report.summary.planProgress).toBeDefined();
      expect(report.summary.planProgress.completionRate).toBe('83.3');
    });
  });
});

// Helper function to create express app for testing
function createTestApp() {
  const express = require('express');
  const app = express();
  
  app.use(express.json());
  app.use('/api/ai-coach', require('../routes/aiCoach'));
  
  return app;
}

module.exports = createTestApp;
