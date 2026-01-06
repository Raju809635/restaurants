const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  PersonalizedPlan,
  PerformanceMetric,
  CoachingSession,
  AIInsight
} = require('../models/AICoach');

const seedAICoachData = async () => {
  try {
    console.log('🌱 Starting AI Coach data seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({ email: { $regex: /seed/ } }),
      PersonalizedPlan.deleteMany({}),
      PerformanceMetric.deleteMany({}),
      CoachingSession.deleteMany({}),
      AIInsight.deleteMany({})
    ]);

    // Create seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        name: 'Alex Johnson',
        email: 'alex.seed@example.com',
        password: hashedPassword,
        level: 12,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.seed@example.com',
        password: hashedPassword,
        level: 25,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
      },
      {
        name: 'Mike Chen',
        email: 'mike.seed@example.com',
        password: hashedPassword,
        level: 8,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      }
    ]);

    console.log(`✅ Created ${users.length} seed users`);

    // Create personalized plans
    const plans = [
      {
        user: users[0]._id,
        workoutPlan: {
          name: 'Cricket Mastery Training',
          description: 'Custom 8-week cricket training plan tailored for Alex Johnson',
          sport: 'Cricket',
          difficulty: 'Intermediate',
          duration: 8,
          frequency: 4,
          exercises: [
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
            }
          ],
          goals: ['technique', 'fitness', 'performance'],
          createdBy: 'AI'
        },
        progress: {
          totalWorkouts: 32,
          completedWorkouts: 18,
          percentage: 56.25
        },
        status: 'active',
        adaptations: [
          {
            reason: 'User feedback: sessions too easy',
            changes: ['Increased exercise intensity by 20%', 'Extended workout duration']
          }
        ]
      },
      {
        user: users[1]._id,
        workoutPlan: {
          name: 'Advanced Football Training',
          description: 'Custom 12-week football training plan tailored for Sarah Williams',
          sport: 'Football',
          difficulty: 'Advanced',
          duration: 12,
          frequency: 5,
          exercises: [
            {
              name: 'Ball Control Drills',
              description: 'Improve first touch and ball control',
              duration: 25,
              difficulty: 'Advanced',
              equipment: ['Football', 'Cones'],
              instructions: [
                'Practice wall passes with both feet',
                'Control the ball with different parts of foot',
                'Juggling for touch improvement',
                'Receive and pass in tight spaces'
              ],
              caloriesBurned: 180,
              targetMuscles: ['Legs', 'Core'],
              sport: 'Football'
            }
          ],
          goals: ['technique', 'speed', 'endurance'],
          createdBy: 'AI'
        },
        progress: {
          totalWorkouts: 60,
          completedWorkouts: 45,
          percentage: 75
        },
        status: 'active'
      },
      {
        user: users[2]._id,
        workoutPlan: {
          name: 'Tennis Fundamentals',
          description: 'Custom 6-week tennis training plan tailored for Mike Chen',
          sport: 'Tennis',
          difficulty: 'Beginner',
          duration: 6,
          frequency: 3,
          exercises: [
            {
              name: 'Forehand Technique',
              description: 'Master the basic forehand stroke',
              duration: 20,
              difficulty: 'Beginner',
              equipment: ['Tennis Racket', 'Tennis Balls'],
              instructions: [
                'Proper grip and stance',
                'Shadow swing without ball',
                'Ball toss and hit against wall',
                'Focus on follow-through'
              ],
              caloriesBurned: 120,
              targetMuscles: ['Arms', 'Core', 'Legs'],
              sport: 'Tennis'
            }
          ],
          goals: ['technique', 'fitness'],
          createdBy: 'AI'
        },
        progress: {
          totalWorkouts: 18,
          completedWorkouts: 12,
          percentage: 66.67
        },
        status: 'active'
      }
    ];

    const createdPlans = await PersonalizedPlan.insertMany(plans);
    console.log(`✅ Created ${createdPlans.length} personalized training plans`);

    // Create performance metrics
    const metrics = [];
    const sports = ['Cricket', 'Football', 'Tennis'];
    
    users.forEach((user, userIndex) => {
      const sport = sports[userIndex];
      
      // Create 15 days worth of metrics with progression
      for (let i = 0; i < 15; i++) {
        const baseScore = 60 + userIndex * 10; // Different base levels for users
        const progression = i * 1.5; // Gradual improvement
        const randomVariation = (Math.random() - 0.5) * 10; // Some randomness
        
        const endurance = Math.max(30, Math.min(100, baseScore + progression + randomVariation));
        const strength = Math.max(30, Math.min(100, baseScore + progression + randomVariation + 5));
        const speed = Math.max(30, Math.min(100, baseScore + progression + randomVariation - 3));
        const agility = Math.max(30, Math.min(100, baseScore + progression + randomVariation + 2));
        const technique = Math.max(30, Math.min(100, baseScore + progression + randomVariation + 7));
        const mental = Math.max(30, Math.min(100, baseScore + progression + randomVariation + 1));
        
        const overallScore = Math.round((endurance + strength + speed + agility + technique + mental) / 6);
        
        metrics.push({
          user: user._id,
          sport,
          metrics: {
            endurance: Math.round(endurance),
            strength: Math.round(strength),
            speed: Math.round(speed),
            agility: Math.round(agility),
            technique: Math.round(technique),
            mental: Math.round(mental)
          },
          overallScore,
          notes: i % 3 === 0 ? 'Feeling strong today!' : i % 3 === 1 ? 'Good session overall' : 'Room for improvement',
          date: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000) // Last 15 days
        });
      }
    });

    const createdMetrics = await PerformanceMetric.insertMany(metrics);
    console.log(`✅ Created ${createdMetrics.length} performance metrics`);

    // Create coaching sessions
    const sessions = [
      {
        user: users[0]._id,
        type: 'chat',
        sport: 'Cricket',
        messages: [
          {
            role: 'user',
            content: 'How can I improve my batting technique?',
            metadata: { intent: 'help_request', sentiment: 'neutral', confidence: 0.8 }
          },
          {
            role: 'ai_coach',
            content: "Great question! To improve your batting technique, focus on these fundamentals: proper stance, head position, and timing. I recommend practicing shadow batting daily and working on your footwork. Based on your current plan, you're making good progress!",
            metadata: { confidence: 0.85, intent: 'response' }
          },
          {
            role: 'user',
            content: 'What about my bowling action?',
            metadata: { intent: 'help_request', sentiment: 'neutral', confidence: 0.8 }
          },
          {
            role: 'ai_coach',
            content: "For bowling, consistency is key. Work on your run-up rhythm and release point. The bowling drills in your plan will help develop muscle memory. Keep practicing and you'll see improvement!",
            metadata: { confidence: 0.82, intent: 'response' }
          }
        ],
        recommendations: ['Practice shadow batting daily', 'Focus on bowling action consistency'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[1]._id,
        type: 'motivation',
        sport: 'Football',
        messages: [
          {
            role: 'user',
            content: 'I\'m feeling tired and need motivation',
            metadata: { intent: 'motivation_request', sentiment: 'negative', confidence: 0.9 }
          },
          {
            role: 'ai_coach',
            content: "I understand you're feeling tired, Sarah. Remember, you've already completed 45 out of 60 workouts - that's 75% complete! Every champion has felt this way. Your dedication is impressive, and you're so close to finishing strong. What would help you push through today?",
            metadata: { confidence: 0.9, intent: 'response' }
          }
        ],
        recommendations: ['Take a rest day if needed', 'Focus on lighter training today'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[2]._id,
        type: 'performance_review',
        sport: 'Tennis',
        messages: [
          {
            role: 'user',
            content: 'How am I progressing in tennis?',
            metadata: { intent: 'progress_inquiry', sentiment: 'neutral', confidence: 0.85 }
          },
          {
            role: 'ai_coach',
            content: "Your tennis progress is excellent, Mike! You've completed 67% of your plan and your technique scores have improved significantly. Your forehand is getting much more consistent. Keep focusing on the fundamentals and you'll be ready for more advanced techniques soon!",
            metadata: { confidence: 0.87, intent: 'response' }
          }
        ],
        recommendations: ['Continue current training routine', 'Consider adding backhand practice'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdSessions = await CoachingSession.insertMany(sessions);
    console.log(`✅ Created ${createdSessions.length} coaching sessions`);

    // Create AI insights
    const insights = [
      // Alex's insights
      {
        user: users[0]._id,
        type: 'performance_trend',
        title: 'Excellent Technique Improvement!',
        description: 'Your cricket technique has improved by 15% over the last two weeks. Your batting stance and timing are showing consistent progress.',
        sport: 'Cricket',
        priority: 'high',
        actionItems: [
          {
            action: 'Continue focusing on shadow batting',
            priority: 'high',
            estimatedImpact: 'Will solidify muscle memory and improve consistency'
          },
          {
            action: 'Add more advanced batting drills',
            priority: 'medium',
            estimatedImpact: 'Ready for next level techniques'
          }
        ],
        viewed: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[0]._id,
        type: 'goal_progress',
        title: 'Halfway to Your Goal!',
        description: 'You\'ve completed 56% of your training plan. Maintain this consistency and you\'ll exceed your fitness goals.',
        sport: 'Cricket',
        priority: 'medium',
        actionItems: [
          {
            action: 'Maintain current workout frequency',
            priority: 'high',
            estimatedImpact: 'Consistency is key to achieving goals'
          }
        ],
        viewed: true,
        viewedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      // Sarah's insights
      {
        user: users[1]._id,
        type: 'performance_trend',
        title: 'Outstanding Endurance Gains',
        description: 'Your endurance has improved by 20% this month! Your cardiovascular fitness is reaching elite levels.',
        sport: 'Football',
        priority: 'high',
        actionItems: [
          {
            action: 'Consider increasing training intensity',
            priority: 'medium',
            estimatedImpact: 'Can handle more challenging workouts now'
          }
        ],
        viewed: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[1]._id,
        type: 'milestone_achievement',
        title: '75% Plan Completion - Amazing!',
        description: 'You\'ve completed 3/4 of your advanced football training plan. Your dedication is inspiring!',
        sport: 'Football',
        priority: 'high',
        actionItems: [
          {
            action: 'Prepare for final training phase',
            priority: 'high',
            estimatedImpact: 'Final push to complete your goals'
          }
        ],
        viewed: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      // Mike's insights
      {
        user: users[2]._id,
        type: 'technique_focus',
        title: 'Forehand Technique Breakthrough',
        description: 'Your forehand technique has improved dramatically! The consistent practice is paying off.',
        sport: 'Tennis',
        priority: 'medium',
        actionItems: [
          {
            action: 'Start working on backhand technique',
            priority: 'medium',
            estimatedImpact: 'Will balance your stroke repertoire'
          }
        ],
        viewed: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[2]._id,
        type: 'goal_progress',
        title: 'Strong Foundation Built',
        description: 'You\'ve built a solid tennis foundation. Ready to move beyond fundamentals soon.',
        sport: 'Tennis',
        priority: 'medium',
        actionItems: [
          {
            action: 'Complete remaining fundamental exercises',
            priority: 'high',
            estimatedImpact: 'Will prepare you for intermediate techniques'
          }
        ],
        viewed: true,
        viewedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdInsights = await AIInsight.insertMany(insights);
    console.log(`✅ Created ${createdInsights.length} AI insights`);

    console.log(`
🎉 AI Coach seed data created successfully!

Summary:
- Users: ${users.length}
- Training Plans: ${createdPlans.length}
- Performance Metrics: ${createdMetrics.length}
- Coaching Sessions: ${createdSessions.length}
- AI Insights: ${createdInsights.length}

Test Users:
1. Alex Johnson (alex.seed@example.com) - Level 12, Cricket, Intermediate
2. Sarah Williams (sarah.seed@example.com) - Level 25, Football, Advanced
3. Mike Chen (mike.seed@example.com) - Level 8, Tennis, Beginner

Password for all users: password123
    `);

    return {
      users,
      plans: createdPlans,
      metrics: createdMetrics,
      sessions: createdSessions,
      insights: createdInsights
    };

  } catch (error) {
    console.error('❌ Error seeding AI Coach data:', error);
    throw error;
  }
};

// Run the seed if this file is executed directly
if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();

  const runSeed = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kreeda');
      console.log('📦 Connected to MongoDB');
      
      await seedAICoachData();
      
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    }
  };

  runSeed();
}

module.exports = seedAICoachData;
