const aiCoachService = require('../services/aiCoachService');
const {
  PersonalizedPlan,
  PerformanceMetric,
  CoachingSession,
  AIInsight,
  WorkoutPlan
} = require('../models/AICoach');

const aiCoachController = {
  /**
   * Generate a new personalized training plan
   * POST /api/ai-coach/plans
   */
  createPersonalizedPlan: async (req, res) => {
    try {
      const { sport, goals, duration, difficulty } = req.body;
      const userId = req.user.id;

      if (!sport || !goals) {
        return res.status(400).json({
          success: false,
          message: 'Sport and goals are required'
        });
      }

      const plan = await aiCoachService.generatePersonalizedPlan(
        userId,
        sport,
        goals,
        duration || 8,
        difficulty || 'Beginner'
      );

      res.status(201).json({
        success: true,
        message: 'Personalized training plan created successfully',
        data: plan
      });
    } catch (error) {
      console.error('Error creating personalized plan:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get user's current active plan
   * GET /api/ai-coach/plans/current
   */
  getCurrentPlan: async (req, res) => {
    try {
      const userId = req.user.id;
      const activePlan = await PersonalizedPlan.getCurrentPlan(userId);

      if (!activePlan) {
        return res.status(404).json({
          success: false,
          message: 'No active training plan found'
        });
      }

      res.json({
        success: true,
        data: activePlan
      });
    } catch (error) {
      console.error('Error getting current plan:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get all user's training plans
   * GET /api/ai-coach/plans
   */
  getUserPlans: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const query = { user: userId };
      if (status) {
        query.status = status;
      }

      const plans = await PersonalizedPlan.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('user', 'name email');

      const total = await PersonalizedPlan.countDocuments(query);

      res.json({
        success: true,
        data: plans,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting user plans:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Update plan progress (mark workout as completed)
   * PUT /api/ai-coach/plans/:planId/progress
   */
  updatePlanProgress: async (req, res) => {
    try {
      const { planId } = req.params;
      const { workoutCompleted, performanceData } = req.body;

      const plan = await PersonalizedPlan.findById(planId);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Training plan not found'
        });
      }

      // Update progress
      if (workoutCompleted) {
        plan.progress.completedWorkouts += 1;
        plan.progress.percentage = (plan.progress.completedWorkouts / plan.progress.totalWorkouts) * 100;
        
        // Mark as completed if all workouts are done
        if (plan.progress.completedWorkouts >= plan.progress.totalWorkouts) {
          plan.status = 'completed';
          plan.completedAt = new Date();
        }
      }

      await plan.save();

      // If performance data is provided, save it
      if (performanceData) {
        const performanceMetric = new PerformanceMetric({
          user: req.user.id,
          sport: plan.workoutPlan.sport,
          metrics: performanceData.metrics || {},
          overallScore: performanceData.overallScore || 0,
          notes: performanceData.notes
        });
        await performanceMetric.save();
      }

      res.json({
        success: true,
        message: 'Plan progress updated successfully',
        data: plan
      });
    } catch (error) {
      console.error('Error updating plan progress:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Provide feedback and adapt plan
   * POST /api/ai-coach/plans/:planId/feedback
   */
  providePlanFeedback: async (req, res) => {
    try {
      const { planId } = req.params;
      const feedback = req.body;

      const adaptedPlan = await aiCoachService.adaptPlan(planId, feedback);

      res.json({
        success: true,
        message: 'Plan adapted based on your feedback',
        data: adaptedPlan
      });
    } catch (error) {
      console.error('Error adapting plan:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Start a coaching chat session
   * POST /api/ai-coach/chat
   */
  startChatSession: async (req, res) => {
    try {
      const { message, sessionType = 'chat', sport } = req.body;
      const userId = req.user.id;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      const response = await aiCoachService.conductCoachingSession(
        userId,
        message,
        sessionType,
        sport
      );

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error in chat session:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get coaching session history
   * GET /api/ai-coach/sessions
   */
  getChatSessions: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, type, sport } = req.query;

      const query = { user: userId };
      if (type) query.type = type;
      if (sport) query.sport = sport;

      const sessions = await CoachingSession.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await CoachingSession.countDocuments(query);

      res.json({
        success: true,
        data: sessions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Analyze user performance
   * POST /api/ai-coach/analyze
   */
  analyzePerformance: async (req, res) => {
    try {
      const { sport } = req.body;
      const userId = req.user.id;

      if (!sport) {
        return res.status(400).json({
          success: false,
          message: 'Sport is required for performance analysis'
        });
      }

      const analysis = await aiCoachService.analyzePerformance(userId, sport);

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Error analyzing performance:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get AI insights
   * GET /api/ai-coach/insights
   */
  getInsights: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, type, sport, priority } = req.query;

      const query = { user: userId };
      if (type) query.type = type;
      if (sport) query.sport = sport;
      if (priority) query.priority = priority;

      const insights = await AIInsight.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await AIInsight.countDocuments(query);

      res.json({
        success: true,
        data: insights,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting insights:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Mark insight as viewed
   * PUT /api/ai-coach/insights/:insightId/viewed
   */
  markInsightViewed: async (req, res) => {
    try {
      const { insightId } = req.params;

      const insight = await AIInsight.findById(insightId);
      if (!insight) {
        return res.status(404).json({
          success: false,
          message: 'Insight not found'
        });
      }

      insight.viewed = true;
      insight.viewedAt = new Date();
      await insight.save();

      res.json({
        success: true,
        message: 'Insight marked as viewed',
        data: insight
      });
    } catch (error) {
      console.error('Error marking insight as viewed:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Generate weekly performance report
   * GET /api/ai-coach/reports/weekly
   */
  getWeeklyReport: async (req, res) => {
    try {
      const userId = req.user.id;

      const report = await aiCoachService.generateWeeklyReport(userId);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error generating weekly report:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get available sports and exercises
   * GET /api/ai-coach/exercises
   */
  getAvailableExercises: async (req, res) => {
    try {
      const { sport, difficulty } = req.query;

      // Access the exercise database from the service
      let exercises = aiCoachService.sportsExerciseDatabase;

      // Filter by sport if specified
      if (sport) {
        exercises = exercises[sport] || [];
      } else {
        // Return all exercises from all sports
        exercises = Object.values(exercises).flat();
      }

      // Filter by difficulty if specified
      if (difficulty && Array.isArray(exercises)) {
        exercises = exercises.filter(exercise => exercise.difficulty === difficulty);
      }

      res.json({
        success: true,
        data: exercises
      });
    } catch (error) {
      console.error('Error getting available exercises:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Add performance metrics
   * POST /api/ai-coach/metrics
   */
  addPerformanceMetric: async (req, res) => {
    try {
      const { sport, metrics, overallScore, notes } = req.body;
      const userId = req.user.id;

      if (!sport || !metrics) {
        return res.status(400).json({
          success: false,
          message: 'Sport and metrics are required'
        });
      }

      const performanceMetric = new PerformanceMetric({
        user: userId,
        sport,
        metrics,
        overallScore: overallScore || 0,
        notes
      });

      await performanceMetric.save();

      res.status(201).json({
        success: true,
        message: 'Performance metrics added successfully',
        data: performanceMetric
      });
    } catch (error) {
      console.error('Error adding performance metric:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get performance metrics history
   * GET /api/ai-coach/metrics
   */
  getPerformanceMetrics: async (req, res) => {
    try {
      const userId = req.user.id;
      const { sport, days = 30, page = 1, limit = 10 } = req.query;

      const query = { user: userId };
      if (sport) query.sport = sport;

      // Filter by date range if specified
      if (days) {
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - parseInt(days));
        query.date = { $gte: dateFrom };
      }

      const metrics = await PerformanceMetric.find(query)
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await PerformanceMetric.countDocuments(query);

      res.json({
        success: true,
        data: metrics,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get coaching dashboard data
   * GET /api/ai-coach/dashboard
   */
  getDashboard: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get active plan
      const activePlan = await PersonalizedPlan.getCurrentPlan(userId);

      // Get recent insights (unviewed first)
      const recentInsights = await AIInsight.find({ user: userId })
        .sort({ viewed: 1, createdAt: -1 })
        .limit(5);

      // Get latest performance metrics
      const latestMetrics = await PerformanceMetric.findOne({ user: userId })
        .sort({ date: -1 });

      // Get recent coaching sessions
      const recentSessions = await CoachingSession.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('type sport createdAt messages.length');

      // Calculate weekly stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyMetrics = await PerformanceMetric.countDocuments({
        user: userId,
        date: { $gte: weekAgo }
      });

      const weeklySessions = await CoachingSession.countDocuments({
        user: userId,
        createdAt: { $gte: weekAgo }
      });

      const dashboard = {
        activePlan: activePlan ? {
          name: activePlan.workoutPlan.name,
          sport: activePlan.workoutPlan.sport,
          progress: activePlan.progress,
          status: activePlan.status
        } : null,
        recentInsights,
        latestPerformance: latestMetrics ? {
          sport: latestMetrics.sport,
          overallScore: latestMetrics.overallScore,
          date: latestMetrics.date
        } : null,
        recentSessions,
        weeklyStats: {
          metricsLogged: weeklyMetrics,
          coachingSessions: weeklySessions
        }
      };

      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = aiCoachController;
