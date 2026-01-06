const {
  PersonalizedPlan,
  PerformanceMetric,
  CoachingSession,
  AIInsight,
  WorkoutPlan
} = require('../models/AICoach');
const User = require('../models/User');

class AICoachService {
  constructor() {
    this.sportsExerciseDatabase = this.initializeExerciseDatabase();
    this.coachingPersonalities = this.initializeCoachingPersonalities();
  }

  /**
   * Initialize exercise database with sport-specific exercises
   */
  initializeExerciseDatabase() {
    return {
      Cricket: [
        {
          name: 'Shadow Batting',
          description: 'Practice batting technique without a ball',
          duration: 15,
          difficulty: 'Beginner',
          equipment: ['Cricket Bat'],
          instructions: [
            'Stand in proper batting stance',
            'Practice forward and backward defensive shots',
            'Focus on footwork and body positioning',
            'Maintain balance throughout the movement'
          ],
          caloriesBurned: 80,
          targetMuscles: ['Core', 'Arms', 'Legs'],
          sport: 'Cricket'
        },
        {
          name: 'Bowling Action Drills',
          description: 'Improve bowling action and accuracy',
          duration: 20,
          difficulty: 'Intermediate',
          equipment: ['Cricket Ball', 'Stumps'],
          instructions: [
            'Start with proper run-up',
            'Focus on arm position during delivery',
            'Maintain consistent line and length',
            'Follow through completely'
          ],
          caloriesBurned: 120,
          targetMuscles: ['Shoulders', 'Core', 'Legs'],
          sport: 'Cricket'
        },
        {
          name: 'Fielding Agility Circuit',
          description: 'Improve fielding reflexes and agility',
          duration: 25,
          difficulty: 'Advanced',
          equipment: ['Cones', 'Cricket Balls'],
          instructions: [
            'Set up cone course for lateral movement',
            'Practice diving catches',
            'Quick pick-up and throw drills',
            'Ground fielding technique'
          ],
          caloriesBurned: 180,
          targetMuscles: ['Full Body'],
          sport: 'Cricket'
        }
      ],
      Football: [
        {
          name: 'Ball Control Drills',
          description: 'Improve first touch and ball control',
          duration: 20,
          difficulty: 'Beginner',
          equipment: ['Football', 'Wall'],
          instructions: [
            'Practice wall passes with both feet',
            'Control the ball with different parts of foot',
            'Juggling for touch improvement',
            'Receive and pass in tight spaces'
          ],
          caloriesBurned: 150,
          targetMuscles: ['Legs', 'Core'],
          sport: 'Football'
        },
        {
          name: 'Sprint Intervals',
          description: 'Build speed and endurance for football',
          duration: 30,
          difficulty: 'Intermediate',
          equipment: ['Cones'],
          instructions: [
            'Mark 30m sprint distance',
            'Sprint at maximum effort',
            'Walk back for recovery',
            'Repeat 8-10 times'
          ],
          caloriesBurned: 250,
          targetMuscles: ['Legs', 'Cardiovascular'],
          sport: 'Football'
        },
        {
          name: 'Tactical Positioning',
          description: 'Improve game awareness and positioning',
          duration: 35,
          difficulty: 'Advanced',
          equipment: ['Cones', 'Football'],
          instructions: [
            'Practice different formations',
            'Work on off-the-ball movement',
            'Defensive positioning drills',
            'Quick transition exercises'
          ],
          caloriesBurned: 200,
          targetMuscles: ['Full Body', 'Mental'],
          sport: 'Football'
        }
      ],
      Tennis: [
        {
          name: 'Forehand Technique',
          description: 'Master the basic forehand stroke',
          duration: 25,
          difficulty: 'Beginner',
          equipment: ['Tennis Racket', 'Tennis Balls'],
          instructions: [
            'Proper grip and stance',
            'Shadow swing without ball',
            'Ball toss and hit against wall',
            'Focus on follow-through'
          ],
          caloriesBurned: 140,
          targetMuscles: ['Arms', 'Core', 'Legs'],
          sport: 'Tennis'
        },
        {
          name: 'Court Movement Drills',
          description: 'Improve court coverage and footwork',
          duration: 30,
          difficulty: 'Intermediate',
          equipment: ['Cones', 'Tennis Court'],
          instructions: [
            'Lateral movement drills',
            'Forward and backward sprints',
            'Change of direction exercises',
            'Split-step practice'
          ],
          caloriesBurned: 200,
          targetMuscles: ['Legs', 'Core', 'Cardiovascular'],
          sport: 'Tennis'
        }
      ],
      Basketball: [
        {
          name: 'Dribbling Skills',
          description: 'Enhance ball handling and control',
          duration: 20,
          difficulty: 'Beginner',
          equipment: ['Basketball'],
          instructions: [
            'Stationary dribbling with both hands',
            'Between the legs dribbling',
            'Behind the back moves',
            'Crossover dribbling'
          ],
          caloriesBurned: 120,
          targetMuscles: ['Arms', 'Core'],
          sport: 'Basketball'
        },
        {
          name: 'Shooting Form',
          description: 'Perfect shooting technique',
          duration: 25,
          difficulty: 'Intermediate',
          equipment: ['Basketball', 'Basketball Hoop'],
          instructions: [
            'Proper shooting stance',
            'Consistent release point',
            'Follow-through technique',
            'Free throw practice'
          ],
          caloriesBurned: 150,
          targetMuscles: ['Arms', 'Core', 'Legs'],
          sport: 'Basketball'
        }
      ]
    };
  }

  /**
   * Initialize different coaching personalities
   */
  initializeCoachingPersonalities() {
    return {
      motivational: {
        name: 'Coach Inspire',
        style: 'Highly motivational and encouraging',
        phrases: [
          "You've got this! Every champion was once a beginner.",
          "Great progress! Let's push a little harder today.",
          "I believe in your potential. Let's unlock it together!"
        ]
      },
      analytical: {
        name: 'Coach Data',
        style: 'Data-driven and technical',
        phrases: [
          "Based on your metrics, I recommend focusing on...",
          "Your performance data shows improvement in...",
          "Let's analyze your technique and optimize it."
        ]
      },
      friendly: {
        name: 'Coach Buddy',
        style: 'Friendly and supportive',
        phrases: [
          "Hey there! Ready for today's session?",
          "You're doing amazing! Keep up the great work.",
          "Remember, progress is progress, no matter how small."
        ]
      }
    };
  }

  /**
   * Generate personalized workout plan based on user profile
   */
  async generatePersonalizedPlan(userId, sport, goals, duration = 8, difficulty = 'Beginner') {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Get user's current fitness level and preferences
      const currentMetrics = await PerformanceMetric.findOne({
        user: userId,
        sport
      }).sort({ date: -1 });

      // Adjust difficulty based on current performance
      if (currentMetrics && currentMetrics.overallScore > 70) {
        difficulty = 'Advanced';
      } else if (currentMetrics && currentMetrics.overallScore > 40) {
        difficulty = 'Intermediate';
      }

      // Get exercises for the sport
      const availableExercises = this.sportsExerciseDatabase[sport] || [];
      
      // Filter exercises by difficulty and user preferences
      const suitableExercises = availableExercises.filter(exercise => {
        if (difficulty === 'Beginner' && exercise.difficulty !== 'Advanced') return true;
        if (difficulty === 'Intermediate' && exercise.difficulty !== 'Beginner') return true;
        if (difficulty === 'Advanced') return true;
        return false;
      });

      // Create workout plan
      const workoutPlan = {
        name: `Personalized ${sport} Training Plan`,
        description: `Custom ${duration}-week ${sport} training plan tailored for ${user.name}`,
        sport,
        difficulty,
        duration,
        frequency: this.calculateOptimalFrequency(user, goals),
        exercises: suitableExercises.slice(0, 6), // Limit to 6 exercises per plan
        goals,
        createdBy: 'AI'
      };

      // Calculate total workouts
      const totalWorkouts = duration * workoutPlan.frequency;

      // Create personalized plan
      const personalizedPlan = new PersonalizedPlan({
        user: userId,
        workoutPlan,
        progress: {
          totalWorkouts,
          completedWorkouts: 0,
          percentage: 0
        }
      });

      await personalizedPlan.save();

      // Generate initial AI insights
      await this.generateInitialInsights(userId, sport, personalizedPlan);

      return personalizedPlan;
    } catch (error) {
      throw new Error(`Failed to generate personalized plan: ${error.message}`);
    }
  }

  /**
   * Calculate optimal workout frequency based on user profile and goals
   */
  calculateOptimalFrequency(user, goals) {
    let baseFrequency = 3; // Default 3 times per week

    // Adjust based on user level
    if (user.level > 10) baseFrequency = 4;
    if (user.level > 20) baseFrequency = 5;

    // Adjust based on goals
    if (goals.includes('weight_loss') || goals.includes('endurance')) {
      baseFrequency += 1;
    }
    if (goals.includes('strength')) {
      baseFrequency += 1;
    }

    return Math.min(baseFrequency, 6); // Max 6 times per week
  }

  /**
   * Analyze user performance and provide insights
   */
  async analyzePerformance(userId, sport) {
    try {
      // Get recent performance metrics
      const recentMetrics = await PerformanceMetric.getPerformanceTrends(userId, sport, 30);
      
      if (recentMetrics.length < 2) {
        return {
          message: 'Need more data points for analysis',
          trends: [],
          recommendations: ['Continue tracking your performance for better insights']
        };
      }

      const latest = recentMetrics[recentMetrics.length - 1];
      const previous = recentMetrics[recentMetrics.length - 2];

      const analysis = {
        trends: [],
        improvements: [],
        concerns: [],
        recommendations: []
      };

      // Analyze each metric
      const metrics = ['endurance', 'strength', 'speed', 'agility', 'technique', 'mental'];
      
      metrics.forEach(metric => {
        if (latest.metrics[metric] && previous.metrics[metric]) {
          const change = latest.metrics[metric] - previous.metrics[metric];
          const changePercent = (change / previous.metrics[metric]) * 100;

          if (Math.abs(changePercent) > 5) {
            if (change > 0) {
              analysis.improvements.push({
                metric,
                improvement: changePercent.toFixed(1),
                message: `Your ${metric} has improved by ${changePercent.toFixed(1)}%`
              });
            } else {
              analysis.concerns.push({
                metric,
                decline: Math.abs(changePercent).toFixed(1),
                message: `Your ${metric} has declined by ${Math.abs(changePercent).toFixed(1)}%`
              });
            }
          }
        }
      });

      // Generate recommendations based on analysis
      analysis.recommendations = this.generatePerformanceRecommendations(analysis, sport);

      return analysis;
    } catch (error) {
      throw new Error(`Performance analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate performance-based recommendations
   */
  generatePerformanceRecommendations(analysis, sport) {
    const recommendations = [];

    // Recommendations based on improvements
    if (analysis.improvements.length > 0) {
      recommendations.push("Great progress! Keep up the current training routine.");
    }

    // Recommendations based on concerns
    analysis.concerns.forEach(concern => {
      switch (concern.metric) {
        case 'endurance':
          recommendations.push("Consider adding more cardio training to boost endurance.");
          break;
        case 'strength':
          recommendations.push("Incorporate strength training exercises into your routine.");
          break;
        case 'speed':
          recommendations.push("Add sprint intervals to improve your speed.");
          break;
        case 'agility':
          recommendations.push("Practice agility drills with cones and ladders.");
          break;
        case 'technique':
          recommendations.push(`Focus on ${sport} technique drills and form correction.`);
          break;
        case 'mental':
          recommendations.push("Consider mental training and visualization exercises.");
          break;
      }
    });

    // Sport-specific recommendations
    switch (sport) {
      case 'Cricket':
        recommendations.push("Practice net sessions regularly for batting and bowling improvement.");
        break;
      case 'Football':
        recommendations.push("Work on both feet - practice with your weaker foot.");
        break;
      case 'Tennis':
        recommendations.push("Focus on consistent baseline shots before advanced techniques.");
        break;
      case 'Basketball':
        recommendations.push("Improve shooting form and practice free throws daily.");
        break;
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  /**
   * Conduct AI coaching chat session
   */
  async conductCoachingSession(userId, messageContent, sessionType = 'chat', sport = null) {
    try {
      // Analyze user message intent and sentiment
      const messageAnalysis = this.analyzeMessage(messageContent);

      // Get user context
      const user = await User.findById(userId);
      const activePlan = await PersonalizedPlan.getCurrentPlan(userId);
      const recentMetrics = await PerformanceMetric.findOne({
        user: userId,
        sport: sport || (activePlan ? activePlan.workoutPlan.sport : 'General')
      }).sort({ date: -1 });

      // Generate AI response
      const aiResponse = await this.generateAIResponse(
        messageContent,
        messageAnalysis,
        user,
        activePlan,
        recentMetrics,
        sport
      );

      // Create or update coaching session
      let session = await CoachingSession.findOne({
        user: userId,
        type: sessionType,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within last 24 hours
      });

      if (!session) {
        session = new CoachingSession({
          user: userId,
          type: sessionType,
          sport,
          messages: []
        });
      }

      // Add messages to session
      session.messages.push({
        role: 'user',
        content: messageContent,
        metadata: messageAnalysis
      });

      session.messages.push({
        role: 'ai_coach',
        content: aiResponse.message,
        metadata: {
          confidence: aiResponse.confidence,
          intent: 'response'
        }
      });

      // Add recommendations if any
      if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
        session.recommendations = aiResponse.recommendations;
      }

      await session.save();

      return {
        message: aiResponse.message,
        recommendations: aiResponse.recommendations,
        sessionId: session._id,
        coachPersonality: aiResponse.personality
      };
    } catch (error) {
      throw new Error(`Coaching session failed: ${error.message}`);
    }
  }

  /**
   * Analyze user message for intent and sentiment
   */
  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple intent detection
    let intent = 'general';
    if (lowerMessage.includes('plan') || lowerMessage.includes('workout') || lowerMessage.includes('training')) {
      intent = 'training_plan';
    } else if (lowerMessage.includes('progress') || lowerMessage.includes('performance') || lowerMessage.includes('improvement')) {
      intent = 'progress_inquiry';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      intent = 'help_request';
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('difficult') || lowerMessage.includes('hard')) {
      intent = 'difficulty_feedback';
    } else if (lowerMessage.includes('motivate') || lowerMessage.includes('encourage')) {
      intent = 'motivation_request';
    }

    // Simple sentiment analysis
    let sentiment = 'neutral';
    const positiveWords = ['good', 'great', 'excellent', 'love', 'enjoy', 'happy', 'excited'];
    const negativeWords = ['bad', 'terrible', 'hate', 'difficult', 'hard', 'frustrated', 'tired'];

    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;

    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    return {
      intent,
      sentiment,
      confidence: 0.8 // Simple confidence score
    };
  }

  /**
   * Generate AI response based on context
   */
  async generateAIResponse(message, analysis, user, activePlan, recentMetrics, sport) {
    let response = '';
    let personality = this.coachingPersonalities.friendly; // Default personality
    const recommendations = [];

    // Choose personality based on user level and message sentiment
    if (user.level < 5 || analysis.sentiment === 'negative') {
      personality = this.coachingPersonalities.motivational;
    } else if (user.level > 15) {
      personality = this.coachingPersonalities.analytical;
    }

    // Generate response based on intent
    switch (analysis.intent) {
      case 'training_plan':
        if (activePlan) {
          response = `${personality.phrases[0]} You're currently on your "${activePlan.workoutPlan.name}" plan. You've completed ${activePlan.progress.completedWorkouts} out of ${activePlan.progress.totalWorkouts} workouts (${activePlan.progress.percentage}% complete). `;
          
          if (activePlan.progress.percentage < 50) {
            response += "Keep going! Consistency is key to seeing results.";
          } else {
            response += "You're making excellent progress! You're more than halfway there.";
          }
        } else {
          response = `Hi ${user.name}! I'd love to help you create a personalized training plan. What sport are you interested in, and what are your main goals?`;
          recommendations.push('Create a new personalized training plan');
        }
        break;

      case 'progress_inquiry':
        if (recentMetrics) {
          response = `Based on your recent performance data, your overall score is ${recentMetrics.overallScore}/100. `;
          
          // Highlight strongest area
          const metrics = recentMetrics.metrics;
          const strongest = Object.entries(metrics).reduce((a, b) => 
            metrics[a[0]] > metrics[b[0]] ? a : b
          );
          
          response += `Your strongest area is ${strongest[0]} (${strongest[1]}/100). `;
          
          if (personality.name === 'Coach Data') {
            response += "I can provide detailed analytics if you'd like to dive deeper into specific metrics.";
          } else {
            response += personality.phrases[1];
          }
        } else {
          response = "I don't have enough performance data yet. Complete a few more workouts or events, and I'll be able to provide detailed progress insights!";
          recommendations.push('Track your next workout or event');
        }
        break;

      case 'difficulty_feedback':
        response = "I understand training can be challenging. ";
        if (analysis.sentiment === 'negative') {
          response += "Remember, every professional athlete has felt this way. What specifically is giving you trouble? I can adjust your plan or provide alternative exercises.";
          recommendations.push('Modify current training plan');
          recommendations.push('Suggest alternative exercises');
        } else {
          response += "That's actually a good sign - it means you're pushing your limits! Should we increase the intensity slightly?";
          recommendations.push('Increase workout intensity');
        }
        break;

      case 'motivation_request':
        response = personality.phrases[Math.floor(Math.random() * personality.phrases.length)];
        if (activePlan) {
          response += ` You've already completed ${activePlan.progress.completedWorkouts} workouts - that's commitment worth celebrating!`;
        }
        response += " What would you like to work on today?";
        break;

      case 'help_request':
        response = `I'm here to help you with your fitness journey! I can:
        • Create personalized training plans
        • Track your progress and performance
        • Provide technique tips and advice
        • Motivate and support you
        • Analyze your strengths and areas for improvement
        
        What would you like assistance with today?`;
        break;

      default:
        response = `Hi ${user.name}! ${personality.phrases[0]} How can I help you with your training today?`;
    }

    return {
      message: response,
      recommendations,
      confidence: 0.85,
      personality: personality.name
    };
  }

  /**
   * Generate initial insights for a new plan
   */
  async generateInitialInsights(userId, sport, plan) {
    try {
      const insights = [
        {
          user: userId,
          type: 'goal_progress',
          title: 'New Training Plan Started!',
          description: `Your personalized ${sport} training plan has been created. Stay consistent and you'll see results in 2-3 weeks.`,
          sport,
          priority: 'medium',
          actionItems: [
            {
              action: 'Complete your first workout this week',
              priority: 'high',
              estimatedImpact: 'Sets foundation for consistent training'
            }
          ]
        }
      ];

      // Add sport-specific insights
      switch (sport) {
        case 'Cricket':
          insights.push({
            user: userId,
            type: 'performance_trend',
            title: 'Cricket Technique Focus',
            description: 'Focus on fundamental techniques before advanced skills. Master the basics for long-term success.',
            sport,
            priority: 'medium',
            actionItems: [
              {
                action: 'Practice shadow batting daily',
                priority: 'medium',
                estimatedImpact: 'Improves muscle memory and technique'
              }
            ]
          });
          break;
        case 'Football':
          insights.push({
            user: userId,
            type: 'performance_trend',
            title: 'Ball Control Priority',
            description: 'Your plan emphasizes ball control - the foundation of all football skills.',
            sport,
            priority: 'medium',
            actionItems: [
              {
                action: 'Practice with both feet equally',
                priority: 'high',
                estimatedImpact: 'Significantly improves game versatility'
              }
            ]
          });
          break;
      }

      // Save insights
      await Promise.all(insights.map(insight => new AIInsight(insight).save()));
    } catch (error) {
      console.error('Failed to generate initial insights:', error);
    }
  }

  /**
   * Update plan based on user feedback
   */
  async adaptPlan(planId, feedback) {
    try {
      const plan = await PersonalizedPlan.findById(planId);
      if (!plan) throw new Error('Plan not found');

      let adaptations = [];

      // Analyze feedback and make adaptations
      if (feedback.difficulty === 'too_hard') {
        adaptations = [
          'Reduced exercise intensity by 15%',
          'Added more rest periods between exercises',
          'Replaced advanced exercises with intermediate alternatives'
        ];
        
        // Update exercises in the plan
        plan.workoutPlan.exercises.forEach(exercise => {
          if (exercise.difficulty === 'Advanced') {
            exercise.difficulty = 'Intermediate';
            exercise.duration = Math.max(exercise.duration - 5, 10);
          }
        });
      } else if (feedback.difficulty === 'too_easy') {
        adaptations = [
          'Increased exercise intensity by 20%',
          'Added more challenging variations',
          'Extended workout duration'
        ];
        
        plan.workoutPlan.exercises.forEach(exercise => {
          exercise.duration += 5;
          if (exercise.difficulty === 'Beginner') {
            exercise.difficulty = 'Intermediate';
          }
        });
      }

      if (feedback.rating <= 2) {
        adaptations.push('Plan restructured based on low satisfaction rating');
      }

      // Record adaptation
      plan.adaptations.push({
        reason: `User feedback: ${feedback.difficulty || 'General feedback'}`,
        changes: adaptations
      });

      await plan.save();

      // Generate insight about adaptation
      await new AIInsight({
        user: plan.user,
        type: 'performance_trend',
        title: 'Training Plan Adapted',
        description: `Your plan has been adjusted based on your feedback. ${adaptations[0]}`,
        sport: plan.workoutPlan.sport,
        priority: 'medium',
        actionItems: [
          {
            action: 'Try the adapted plan for one week',
            priority: 'medium',
            estimatedImpact: 'Better plan alignment with your fitness level'
          }
        ]
      }).save();

      return plan;
    } catch (error) {
      throw new Error(`Plan adaptation failed: ${error.message}`);
    }
  }

  /**
   * Generate weekly performance report
   */
  async generateWeeklyReport(userId) {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const activePlan = await PersonalizedPlan.getCurrentPlan(userId);
      const weeklyMetrics = await PerformanceMetric.find({
        user: userId,
        date: { $gte: weekAgo }
      }).sort({ date: -1 });

      const report = {
        weekPeriod: {
          start: weekAgo,
          end: new Date()
        },
        summary: {},
        achievements: [],
        areasForImprovement: [],
        nextWeekRecommendations: []
      };

      // Analyze plan progress
      if (activePlan) {
        const workoutsThisWeek = activePlan.workoutPlan.frequency;
        const completionRate = (activePlan.progress.completedWorkouts / activePlan.progress.totalWorkouts) * 100;
        
        report.summary.planProgress = {
          planName: activePlan.workoutPlan.name,
          completionRate: completionRate.toFixed(1),
          workoutsCompleted: activePlan.progress.completedWorkouts,
          totalWorkouts: activePlan.progress.totalWorkouts
        };

        if (completionRate > 80) {
          report.achievements.push('Excellent plan adherence this week!');
        }
      }

      // Analyze performance metrics
      if (weeklyMetrics.length > 0) {
        const latestMetric = weeklyMetrics[0];
        const overallScore = latestMetric.overallScore;

        report.summary.performanceScore = overallScore;

        if (overallScore >= 80) {
          report.achievements.push('Outstanding performance scores!');
        } else if (overallScore < 50) {
          report.areasForImprovement.push('Focus on improving overall performance consistency');
        }

        // Identify strongest and weakest metrics
        const metrics = latestMetric.metrics;
        const sortedMetrics = Object.entries(metrics)
          .filter(([_, value]) => value !== null && value !== undefined)
          .sort((a, b) => b[1] - a[1]);

        if (sortedMetrics.length > 0) {
          report.achievements.push(`Strongest area: ${sortedMetrics[0][0]} (${sortedMetrics[0][1]}/100)`);
          
          if (sortedMetrics.length > 1) {
            const weakestMetric = sortedMetrics[sortedMetrics.length - 1];
            report.areasForImprovement.push(`Focus on improving ${weakestMetric[0]} (${weakestMetric[1]}/100)`);
          }
        }
      }

      // Generate next week recommendations
      report.nextWeekRecommendations = [
        'Maintain consistent workout schedule',
        'Focus on identified areas for improvement',
        'Track your progress after each session'
      ];

      if (activePlan) {
        const remainingWeeks = Math.ceil((activePlan.progress.totalWorkouts - activePlan.progress.completedWorkouts) / activePlan.workoutPlan.frequency);
        report.nextWeekRecommendations.push(`${remainingWeeks} weeks remaining in your current plan`);
      }

      return report;
    } catch (error) {
      throw new Error(`Weekly report generation failed: ${error.message}`);
    }
  }
}

module.exports = new AICoachService();
