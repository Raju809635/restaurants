import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Target,
  Calendar,
  TrendingUp,
  CheckCircle,
  Circle,
  Zap,
  Award,
  Heart,
  Dumbbell,
} from 'lucide-react-native';
import { useCreatePersonalizedPlan, useAvailableExercises } from '../hooks/useAICoach';

interface PlanBuilderProps {
  navigation: any;
}

interface GoalOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface SportOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export default function PlanBuilder({ navigation }: PlanBuilderProps) {
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(8);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Beginner');
  const [currentStep, setCurrentStep] = useState<number>(1);

  const createPlan = useCreatePersonalizedPlan();
  const exercises = useAvailableExercises({ sport: selectedSport });

  const sports: SportOption[] = [
    {
      id: 'Cricket',
      label: 'Cricket',
      icon: '🏏',
      description: 'Batting, bowling, fielding skills'
    },
    {
      id: 'Football',
      label: 'Football',
      icon: '⚽',
      description: 'Ball control, passing, shooting'
    },
    {
      id: 'Tennis',
      label: 'Tennis',
      icon: '🎾',
      description: 'Strokes, movement, court coverage'
    },
    {
      id: 'Basketball',
      label: 'Basketball',
      icon: '🏀',
      description: 'Shooting, dribbling, defense'
    },
    {
      id: 'Badminton',
      label: 'Badminton',
      icon: '🏸',
      description: 'Shots, footwork, agility'
    },
    {
      id: 'Swimming',
      label: 'Swimming',
      icon: '🏊',
      description: 'Technique, endurance, speed'
    },
  ];

  const goals: GoalOption[] = [
    {
      id: 'fitness',
      label: 'General Fitness',
      icon: <Heart size={24} color="#FF6B35" strokeWidth={2} />,
      description: 'Improve overall health and fitness'
    },
    {
      id: 'technique',
      label: 'Skill Development',
      icon: <Target size={24} color="#10B981" strokeWidth={2} />,
      description: 'Master sport-specific techniques'
    },
    {
      id: 'strength',
      label: 'Build Strength',
      icon: <Dumbbell size={24} color="#8B5CF6" strokeWidth={2} />,
      description: 'Increase muscle strength and power'
    },
    {
      id: 'endurance',
      label: 'Boost Endurance',
      icon: <TrendingUp size={24} color="#3B82F6" strokeWidth={2} />,
      description: 'Improve cardiovascular fitness'
    },
    {
      id: 'speed',
      label: 'Increase Speed',
      icon: <Zap size={24} color="#F59E0B" strokeWidth={2} />,
      description: 'Develop quickness and agility'
    },
    {
      id: 'performance',
      label: 'Competition Prep',
      icon: <Award size={24} color="#EF4444" strokeWidth={2} />,
      description: 'Prepare for competitions'
    },
  ];

  const durations = [
    { weeks: 4, label: '4 Weeks', description: 'Quick Start' },
    { weeks: 6, label: '6 Weeks', description: 'Foundation' },
    { weeks: 8, label: '8 Weeks', description: 'Recommended' },
    { weeks: 12, label: '12 Weeks', description: 'Comprehensive' },
  ];

  const difficulties = [
    { 
      id: 'Beginner', 
      label: 'Beginner', 
      description: 'New to the sport or fitness',
      color: '#10B981'
    },
    { 
      id: 'Intermediate', 
      label: 'Intermediate', 
      description: 'Some experience and basic skills',
      color: '#F59E0B'
    },
    { 
      id: 'Advanced', 
      label: 'Advanced', 
      description: 'Experienced with good technique',
      color: '#EF4444'
    },
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return selectedSport !== '';
      case 2: return selectedGoals.length > 0;
      case 3: return selectedDuration > 0;
      case 4: return selectedDifficulty !== '';
      default: return false;
    }
  };

  const handleCreatePlan = async () => {
    if (!selectedSport || selectedGoals.length === 0) {
      Alert.alert('Error', 'Please complete all selections');
      return;
    }

    try {
      const newPlan = await createPlan.mutateAsync({
        sport: selectedSport,
        goals: selectedGoals,
        duration: selectedDuration,
        difficulty: selectedDifficulty,
      });

      Alert.alert(
        'Success!',
        'Your personalized training plan has been created.',
        [
          {
            text: 'View Plan',
            onPress: () => navigation.navigate('PlanDetails', { plan: newPlan })
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create plan');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4, 5].map((step) => (
        <View key={step} style={styles.stepWrapper}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive,
            currentStep > step && styles.stepCircleCompleted,
          ]}>
            {currentStep > step ? (
              <CheckCircle size={16} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive
              ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 5 && <View style={[
            styles.stepLine,
            currentStep > step && styles.stepLineCompleted
          ]} />}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Choose Your Sport</Text>
        <Text style={styles.stepDescription}>
          Select the sport you want to focus on
        </Text>
      </View>

      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {sports.map((sport) => (
          <TouchableOpacity
            key={sport.id}
            style={[
              styles.optionCard,
              selectedSport === sport.id && styles.optionCardSelected
            ]}
            onPress={() => setSelectedSport(sport.id)}
          >
            <View style={styles.optionContent}>
              <Text style={styles.sportIcon}>{sport.icon}</Text>
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionTitle,
                  selectedSport === sport.id && styles.optionTitleSelected
                ]}>
                  {sport.label}
                </Text>
                <Text style={styles.optionDescription}>
                  {sport.description}
                </Text>
              </View>
            </View>
            {selectedSport === sport.id && (
              <CheckCircle size={24} color="#FF6B35" strokeWidth={2} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Set Your Goals</Text>
        <Text style={styles.stepDescription}>
          Select one or more training objectives (you can choose multiple)
        </Text>
      </View>

      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {goals.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);
          return (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected
              ]}
              onPress={() => toggleGoal(goal.id)}
            >
              <View style={styles.optionContent}>
                <View style={styles.goalIcon}>{goal.icon}</View>
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionTitle,
                    isSelected && styles.optionTitleSelected
                  ]}>
                    {goal.label}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {goal.description}
                  </Text>
                </View>
              </View>
              {isSelected ? (
                <CheckCircle size={24} color="#FF6B35" strokeWidth={2} />
              ) : (
                <Circle size={24} color="#D1D5DB" strokeWidth={2} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Plan Duration</Text>
        <Text style={styles.stepDescription}>
          How long do you want your training plan to be?
        </Text>
      </View>

      <View style={styles.durationContainer}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration.weeks}
            style={[
              styles.durationCard,
              selectedDuration === duration.weeks && styles.durationCardSelected
            ]}
            onPress={() => setSelectedDuration(duration.weeks)}
          >
            <Calendar 
              size={32} 
              color={selectedDuration === duration.weeks ? '#FF6B35' : '#6B7280'} 
              strokeWidth={2} 
            />
            <Text style={[
              styles.durationLabel,
              selectedDuration === duration.weeks && styles.durationLabelSelected
            ]}>
              {duration.label}
            </Text>
            <Text style={styles.durationDescription}>
              {duration.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Difficulty Level</Text>
        <Text style={styles.stepDescription}>
          Choose based on your current fitness and skill level
        </Text>
      </View>

      <View style={styles.difficultyContainer}>
        {difficulties.map((difficulty) => (
          <TouchableOpacity
            key={difficulty.id}
            style={[
              styles.difficultyCard,
              selectedDifficulty === difficulty.id && styles.difficultyCardSelected
            ]}
            onPress={() => setSelectedDifficulty(difficulty.id)}
          >
            <View style={[
              styles.difficultyIndicator,
              { backgroundColor: difficulty.color }
            ]} />
            <View style={styles.difficultyContent}>
              <Text style={[
                styles.difficultyTitle,
                selectedDifficulty === difficulty.id && styles.difficultyTitleSelected
              ]}>
                {difficulty.label}
              </Text>
              <Text style={styles.difficultyDescription}>
                {difficulty.description}
              </Text>
            </View>
            {selectedDifficulty === difficulty.id && (
              <CheckCircle size={24} color="#FF6B35" strokeWidth={2} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Plan Summary</Text>
        <Text style={styles.stepDescription}>
          Review your selections and create your plan
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sport:</Text>
            <Text style={styles.summaryValue}>
              {sports.find(s => s.id === selectedSport)?.label}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Goals:</Text>
            <Text style={styles.summaryValue}>
              {selectedGoals.map(g => 
                goals.find(goal => goal.id === g)?.label
              ).join(', ')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{selectedDuration} weeks</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Difficulty:</Text>
            <Text style={styles.summaryValue}>{selectedDifficulty}</Text>
          </View>
        </View>

        {exercises.data && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>
              Preview: {exercises.data.length} exercises available
            </Text>
            <Text style={styles.previewDescription}>
              Your AI coach will create a personalized plan with exercises 
              tailored to your goals and difficulty level.
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Create Training Plan</Text>
          <Text style={styles.headerSubtitle}>Step {currentStep} of 5</Text>
        </View>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setCurrentStep(prev => prev - 1)}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            !canProceedToNext() && styles.primaryButtonDisabled,
            currentStep === 5 && createPlan.isPending && styles.primaryButtonLoading
          ]}
          onPress={() => {
            if (currentStep === 5) {
              handleCreatePlan();
            } else {
              setCurrentStep(prev => prev + 1);
            }
          }}
          disabled={!canProceedToNext() || createPlan.isPending}
        >
          {createPlan.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {currentStep === 5 ? 'Create Plan' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stepCircleActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF7ED',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sportIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  goalIcon: {
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#FF6B35',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  durationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  durationCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF7ED',
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  durationLabelSelected: {
    color: '#FF6B35',
  },
  durationDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  difficultyContainer: {
    gap: 12,
  },
  difficultyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF7ED',
  },
  difficultyIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  difficultyTitleSelected: {
    color: '#FF6B35',
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryContainer: {
    gap: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    width: '30%',
  },
  summaryValue: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  previewCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#075985',
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  primaryButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  primaryButtonLoading: {
    backgroundColor: '#FF6B35',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
