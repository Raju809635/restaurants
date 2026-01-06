import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Brain,
  Target,
  TrendingUp,
  Calendar,
  MessageCircle,
  Award,
  BarChart3,
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react-native';
import { useAICoachOverview, useMarkInsightViewed } from '../hooks/useAICoach';
import { AIInsight } from '../services/aiCoachApi';

interface AICoachDashboardProps {
  navigation: any;
}

export default function AICoachDashboard({ navigation }: AICoachDashboardProps) {
  const {
    dashboard,
    currentPlan,
    recentInsights,
    isLoading,
    isError,
    error
  } = useAICoachOverview();

  const markInsightViewed = useMarkInsightViewed();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      dashboard.refetch(),
      currentPlan.refetch(),
      recentInsights.refetch(),
    ]);
    setRefreshing(false);
  }, [dashboard, currentPlan, recentInsights]);

  const handleInsightPress = async (insight: AIInsight) => {
    if (!insight.viewed) {
      try {
        await markInsightViewed.mutateAsync(insight._id);
      } catch (error) {
        console.error('Failed to mark insight as viewed:', error);
      }
    }
    
    navigation.navigate('InsightDetail', { insight });
  };

  const handleStartChat = () => {
    navigation.navigate('AICoachChat');
  };

  const handleViewPlan = () => {
    if (currentPlan.data) {
      navigation.navigate('PlanDetails', { plan: currentPlan.data });
    }
  };

  const handleCreatePlan = () => {
    navigation.navigate('PlanBuilder');
  };

  const handleViewPerformance = () => {
    navigation.navigate('PerformanceScreen');
  };

  const handleViewReports = () => {
    navigation.navigate('WeeklyReport');
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {(error as any)?.message || 'Failed to load AI Coach data'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading your AI Coach...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dashboardData = dashboard.data;
  const activePlan = dashboardData?.activePlan;
  const insights = recentInsights.data?.data || [];
  const weeklyStats = dashboardData?.weeklyStats;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Brain size={32} color="#FF6B35" strokeWidth={2} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>AI Coach Dashboard</Text>
              <Text style={styles.headerSubtitle}>Your personalized training companion</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.chatButton} onPress={handleStartChat}>
            <MessageCircle size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Active Plan Card */}
        {activePlan ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Target size={24} color="#FF6B35" strokeWidth={2} />
                <Text style={styles.cardTitle}>Current Training Plan</Text>
              </View>
              <Text style={styles.planStatus}>{activePlan.status}</Text>
            </View>
            
            <Text style={styles.planName}>{activePlan.name}</Text>
            <Text style={styles.planSport}>{activePlan.sport}</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${activePlan.progress.percentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {activePlan.progress.completedWorkouts} / {activePlan.progress.totalWorkouts} workouts
              </Text>
            </View>
            
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleViewPlan}>
                <Play size={16} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.primaryButtonText}>Continue Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.emptyPlanContainer}>
              <Target size={48} color="#D1D5DB" strokeWidth={1.5} />
              <Text style={styles.emptyPlanTitle}>No Active Training Plan</Text>
              <Text style={styles.emptyPlanSubtitle}>
                Create a personalized plan to start your fitness journey
              </Text>
              <TouchableOpacity style={styles.primaryButton} onPress={handleCreatePlan}>
                <Text style={styles.primaryButtonText}>Create Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Stats */}
        {weeklyStats && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <BarChart3 size={24} color="#10B981" strokeWidth={2} />
                <Text style={styles.statValue}>{weeklyStats.metricsLogged}</Text>
                <Text style={styles.statLabel}>Metrics Logged</Text>
              </View>
              <View style={styles.statCard}>
                <MessageCircle size={24} color="#3B82F6" strokeWidth={2} />
                <Text style={styles.statValue}>{weeklyStats.coachingSessions}</Text>
                <Text style={styles.statLabel}>Coaching Chats</Text>
              </View>
              <View style={styles.statCard}>
                <TrendingUp size={24} color="#8B5CF6" strokeWidth={2} />
                <Text style={styles.statValue}>
                  {dashboardData?.latestPerformance?.overallScore || '--'}
                </Text>
                <Text style={styles.statLabel}>Latest Score</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            <TouchableOpacity onPress={() => navigation.navigate('InsightsScreen')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {insights.length > 0 ? (
            <View style={styles.insightsContainer}>
              {insights.slice(0, 3).map((insight) => (
                <TouchableOpacity
                  key={insight._id}
                  style={[
                    styles.insightCard,
                    !insight.viewed && styles.unreadInsight
                  ]}
                  onPress={() => handleInsightPress(insight)}
                >
                  <View style={styles.insightHeader}>
                    <View style={styles.insightIcon}>
                      {getInsightIcon(insight.type, insight.priority)}
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle} numberOfLines={1}>
                        {insight.title}
                      </Text>
                      <Text style={styles.insightDescription} numberOfLines={2}>
                        {insight.description}
                      </Text>
                    </View>
                    {!insight.viewed && <View style={styles.unreadDot} />}
                  </View>
                  <View style={styles.insightFooter}>
                    <Text style={styles.insightSport}>{insight.sport}</Text>
                    <Text style={styles.insightTime}>
                      {formatTimeAgo(insight.createdAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyInsights}>
              <AlertCircle size={32} color="#D1D5DB" strokeWidth={1.5} />
              <Text style={styles.emptyInsightsText}>
                No insights yet. Start tracking your performance!
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewPerformance}>
            <BarChart3 size={20} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.actionButtonText}>Performance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleViewReports}>
            <Calendar size={20} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.actionButtonText}>Weekly Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('ExerciseCatalog')}
          >
            <Users size={20} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.actionButtonText}>Exercises</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getInsightIcon(type: string, priority: string) {
  const color = priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#10B981';
  const size = 20;
  
  switch (type) {
    case 'performance_trend':
      return <TrendingUp size={size} color={color} strokeWidth={2} />;
    case 'goal_progress':
      return <Target size={size} color={color} strokeWidth={2} />;
    case 'technique_focus':
      return <CheckCircle size={size} color={color} strokeWidth={2} />;
    case 'milestone_achievement':
      return <Award size={size} color={color} strokeWidth={2} />;
    default:
      return <AlertCircle size={size} color={color} strokeWidth={2} />;
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return `${Math.floor(diffInHours / 24)}d ago`;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  planStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'capitalize',
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  planSport: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyPlanContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyPlanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyPlanSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadInsight: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  insightIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginLeft: 8,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightSport: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  insightTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyInsights: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyInsightsText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    marginTop: 8,
  },
});
