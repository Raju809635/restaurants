const express = require('express');
const auth = require('../middleware/auth');
const aiCoachController = require('../controllers/aiCoachController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Validation middleware helper
const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter(field => !req.body[field]);
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(', ')}`
    });
  }
  next();
};

// Training Plan Routes
router.post('/plans', 
  validateRequired(['sport', 'goals']), 
  aiCoachController.createPersonalizedPlan
);

router.get('/plans/current', aiCoachController.getCurrentPlan);
router.get('/plans', aiCoachController.getUserPlans);

router.put('/plans/:planId/progress', 
  aiCoachController.updatePlanProgress
);

router.post('/plans/:planId/feedback', 
  aiCoachController.providePlanFeedback
);

// Coaching Chat Routes
router.post('/chat', 
  validateRequired(['message']), 
  aiCoachController.startChatSession
);

router.get('/sessions', aiCoachController.getChatSessions);

// Performance Analysis Routes
router.post('/analyze', 
  validateRequired(['sport']), 
  aiCoachController.analyzePerformance
);

router.post('/metrics', 
  validateRequired(['sport', 'metrics']), 
  aiCoachController.addPerformanceMetric
);

router.get('/metrics', aiCoachController.getPerformanceMetrics);

// Insights Routes
router.get('/insights', aiCoachController.getInsights);
router.put('/insights/:insightId/viewed', aiCoachController.markInsightViewed);

// Reports Routes
router.get('/reports/weekly', aiCoachController.getWeeklyReport);

// Catalog Routes
router.get('/exercises', aiCoachController.getAvailableExercises);

// Dashboard Route
router.get('/dashboard', aiCoachController.getDashboard);

module.exports = router;
