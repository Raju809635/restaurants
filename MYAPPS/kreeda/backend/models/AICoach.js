const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  equipment: [{
    type: String
  }],
  instructions: [{
    type: String,
    required: true
  }],
  videoUrl: String,
  imageUrl: String,
  caloriesBurned: Number,
  targetMuscles: [{
    type: String
  }],
  sport: {
    type: String,
    required: true
  }
});

const workoutPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  sport: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: Number, // in weeks
    required: true
  },
  frequency: {
    type: Number, // workouts per week
    required: true
  },
  exercises: [exerciseSchema],
  goals: [{
    type: String
  }],
  createdBy: {
    type: String,
    enum: ['AI', 'Professional', 'Community'],
    default: 'AI'
  }
});

const personalizedPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutPlan: workoutPlanSchema,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  progress: {
    completedWorkouts: {
      type: Number,
      default: 0
    },
    totalWorkouts: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      default: 0
    },
    streakDays: {
      type: Number,
      default: 0
    },
    lastWorkoutDate: Date
  },
  adaptations: [{
    date: {
      type: Date,
      default: Date.now
    },
    reason: String,
    changes: [{
      type: String
    }]
  }],
  feedback: [{
    date: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    difficulty: {
      type: String,
      enum: ['too_easy', 'just_right', 'too_hard']
    }
  }]
}, {
  timestamps: true
});

const performanceMetricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  metrics: {
    endurance: Number,
    strength: Number,
    speed: Number,
    agility: Number,
    technique: Number,
    mental: Number
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  improvements: [{
    metric: String,
    previousValue: Number,
    currentValue: Number,
    improvementPercentage: Number
  }],
  recommendations: [{
    type: String
  }],
  dataSource: {
    type: String,
    enum: ['manual', 'event_participation', 'workout_completion', 'assessment'],
    default: 'manual'
  }
}, {
  timestamps: true
});

const coachingSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['chat', 'assessment', 'plan_creation', 'progress_review', 'motivation'],
    required: true
  },
  sport: String,
  messages: [{
    role: {
      type: String,
      enum: ['user', 'ai_coach'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      sentiment: String,
      intent: String,
      confidence: Number
    }
  }],
  recommendations: [{
    type: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    category: {
      type: String,
      enum: ['training', 'nutrition', 'recovery', 'technique', 'mental']
    }
  }],
  outcome: {
    planGenerated: Boolean,
    assessmentCompleted: Boolean,
    goalsSet: [{
      goal: String,
      targetDate: Date,
      measurable: Boolean
    }]
  },
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  }
}, {
  timestamps: true
});

const aiInsightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['performance_trend', 'goal_progress', 'weakness_identified', 'strength_highlighted', 'plateau_detected', 'injury_risk'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sport: String,
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  actionItems: [{
    action: String,
    priority: String,
    estimatedImpact: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  isActioned: {
    type: Boolean,
    default: false
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes for performance
personalizedPlanSchema.index({ user: 1, status: 1 });
performanceMetricSchema.index({ user: 1, sport: 1, date: -1 });
coachingSessionSchema.index({ user: 1, createdAt: -1 });
aiInsightSchema.index({ user: 1, isRead: 1, priority: 1 });

// Virtual for plan completion percentage
personalizedPlanSchema.virtual('completionPercentage').get(function() {
  if (this.progress.totalWorkouts === 0) return 0;
  return Math.round((this.progress.completedWorkouts / this.progress.totalWorkouts) * 100);
});

// Method to update plan progress
personalizedPlanSchema.methods.updateProgress = function() {
  this.progress.percentage = this.completionPercentage;
  if (this.progress.percentage >= 100) {
    this.status = 'completed';
    this.endDate = new Date();
  }
  return this.save();
};

// Method to add feedback
personalizedPlanSchema.methods.addFeedback = function(rating, comment, difficulty) {
  this.feedback.push({ rating, comment, difficulty });
  return this.save();
};

// Static method to get user's current active plan
personalizedPlanSchema.statics.getCurrentPlan = function(userId) {
  return this.findOne({ user: userId, status: 'active' });
};

// Method to calculate overall performance score
performanceMetricSchema.methods.calculateOverallScore = function() {
  const metrics = this.metrics;
  const weights = {
    endurance: 0.2,
    strength: 0.2,
    speed: 0.15,
    agility: 0.15,
    technique: 0.2,
    mental: 0.1
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [metric, value] of Object.entries(metrics)) {
    if (value !== undefined && value !== null && weights[metric]) {
      totalScore += value * weights[metric];
      totalWeight += weights[metric];
    }
  }
  
  this.overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  return this.overallScore;
};

// Static method to get performance trends
performanceMetricSchema.statics.getPerformanceTrends = function(userId, sport, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    user: userId,
    sport,
    date: { $gte: startDate }
  }).sort({ date: 1 });
};

const PersonalizedPlan = mongoose.model('PersonalizedPlan', personalizedPlanSchema);
const PerformanceMetric = mongoose.model('PerformanceMetric', performanceMetricSchema);
const CoachingSession = mongoose.model('CoachingSession', coachingSessionSchema);
const AIInsight = mongoose.model('AIInsight', aiInsightSchema);
const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

module.exports = {
  PersonalizedPlan,
  PerformanceMetric,
  CoachingSession,
  AIInsight,
  WorkoutPlan
};
