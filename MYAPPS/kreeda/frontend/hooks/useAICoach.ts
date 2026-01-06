import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  aiCoachApi, 
  PersonalizedPlan, 
  PerformanceMetric, 
  AIInsight,
  CoachingSession,
  WeeklyReport,
  DashboardData,
  Exercise
} from '../services/aiCoachApi';

// Query keys for React Query
export const aiCoachKeys = {
  all: ['aiCoach'] as const,
  dashboard: () => [...aiCoachKeys.all, 'dashboard'] as const,
  currentPlan: () => [...aiCoachKeys.all, 'currentPlan'] as const,
  plans: (filters: any = {}) => [...aiCoachKeys.all, 'plans', filters] as const,
  insights: (filters: any = {}) => [...aiCoachKeys.all, 'insights', filters] as const,
  metrics: (filters: any = {}) => [...aiCoachKeys.all, 'metrics', filters] as const,
  sessions: (filters: any = {}) => [...aiCoachKeys.all, 'sessions', filters] as const,
  exercises: (filters: any = {}) => [...aiCoachKeys.all, 'exercises', filters] as const,
  weeklyReport: () => [...aiCoachKeys.all, 'weeklyReport'] as const,
  analysis: (sport: string) => [...aiCoachKeys.all, 'analysis', sport] as const,
};

// Dashboard Hook
export function useAICoachDashboard() {
  return useQuery({
    queryKey: aiCoachKeys.dashboard(),
    queryFn: aiCoachApi.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

// Current Plan Hooks
export function useCurrentPlan() {
  return useQuery({
    queryKey: aiCoachKeys.currentPlan(),
    queryFn: aiCoachApi.getCurrentPlan,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreatePersonalizedPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: aiCoachApi.createPersonalizedPlan,
    onSuccess: (newPlan) => {
      // Invalidate and refetch current plan
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.currentPlan() });
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.plans() });
      
      // Set as current plan in cache
      queryClient.setQueryData(aiCoachKeys.currentPlan(), newPlan);
    },
  });
}

export function useUpdatePlanProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ planId, data }: { 
      planId: string; 
      data: { 
        workoutCompleted?: boolean;
        performanceData?: any;
      };
    }) => aiCoachApi.updatePlanProgress(planId, data),
    onSuccess: (updatedPlan, { planId }) => {
      // Update current plan if it's the same
      queryClient.setQueryData(aiCoachKeys.currentPlan(), (oldData: PersonalizedPlan | null | undefined) => {
        if (oldData && oldData._id === planId) {
          return updatedPlan;
        }
        return oldData;
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.metrics() });
    },
  });
}

export function useProvidePlanFeedback() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ planId, feedback }: { planId: string; feedback: any }) => 
      aiCoachApi.providePlanFeedback(planId, feedback),
    onSuccess: (updatedPlan, { planId }) => {
      queryClient.setQueryData(aiCoachKeys.currentPlan(), (oldData: PersonalizedPlan | null | undefined) => {
        if (oldData && oldData._id === planId) {
          return updatedPlan;
        }
        return oldData;
      });
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.plans() });
    },
  });
}

// Plans Hook
export function useUserPlans(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: aiCoachKeys.plans(params),
    queryFn: () => aiCoachApi.getUserPlans(params),
    keepPreviousData: true,
  });
}

// Chat Hooks
export function useSendChatMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: aiCoachApi.sendChatMessage,
    onSuccess: () => {
      // Invalidate chat sessions to refetch updated messages
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.dashboard() });
    },
  });
}

export function useChatSessions(params?: { 
  page?: number; 
  limit?: number; 
  type?: string; 
  sport?: string;
}) {
  return useQuery({
    queryKey: aiCoachKeys.sessions(params),
    queryFn: () => aiCoachApi.getChatSessions(params),
    keepPreviousData: true,
  });
}

// Performance Hooks
export function usePerformanceMetrics(params?: {
  sport?: string;
  days?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: aiCoachKeys.metrics(params),
    queryFn: () => aiCoachApi.getPerformanceMetrics(params),
    keepPreviousData: true,
  });
}

export function useAddPerformanceMetric() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: aiCoachApi.addPerformanceMetric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.dashboard() });
      // Note: analysis requires sport parameter, invalidating without specific sport
      // queryClient.invalidateQueries({ queryKey: aiCoachKeys.analysis() });
    },
  });
}

export function useAnalyzePerformance() {
  return useMutation({
    mutationFn: (sport: string) => aiCoachApi.analyzePerformance(sport),
  });
}

// Insights Hooks
export function useInsights(params?: { 
  page?: number; 
  limit?: number; 
  type?: string; 
  sport?: string; 
  priority?: string;
}) {
  return useQuery({
    queryKey: aiCoachKeys.insights(params),
    queryFn: () => aiCoachApi.getInsights(params),
    keepPreviousData: true,
  });
}

export function useMarkInsightViewed() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (insightId: string) => aiCoachApi.markInsightViewed(insightId),
    onSuccess: (updatedInsight) => {
      // Update insight in all relevant queries
      queryClient.setQueriesData(
        { queryKey: aiCoachKeys.insights() },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            data: oldData.data.map((insight: AIInsight) =>
              insight._id === updatedInsight._id ? updatedInsight : insight
            ),
          };
        }
      );
      
      queryClient.invalidateQueries({ queryKey: aiCoachKeys.dashboard() });
    },
  });
}

// Reports Hook
export function useWeeklyReport() {
  return useQuery({
    queryKey: aiCoachKeys.weeklyReport(),
    queryFn: aiCoachApi.getWeeklyReport,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Exercises Hook
export function useAvailableExercises(params?: { sport?: string; difficulty?: string }) {
  return useQuery({
    queryKey: aiCoachKeys.exercises(params),
    queryFn: () => aiCoachApi.getAvailableExercises(params),
    staleTime: 60 * 60 * 1000, // 1 hour - exercises don't change often
  });
}

// Combined hooks for specific use cases
export function useAICoachOverview() {
  const dashboard = useAICoachDashboard();
  const currentPlan = useCurrentPlan();
  const recentInsights = useInsights({ limit: 5, page: 1 });
  
  return {
    dashboard,
    currentPlan,
    recentInsights,
    isLoading: dashboard.isLoading || currentPlan.isLoading || recentInsights.isLoading,
    isError: dashboard.isError || currentPlan.isError || recentInsights.isError,
    error: dashboard.error || currentPlan.error || recentInsights.error,
  };
}

export function usePerformanceOverview(sport?: string, days: number = 30) {
  const metrics = usePerformanceMetrics({ sport, days });
  const analyzePerformance = useAnalyzePerformance();
  
  const runAnalysis = () => {
    if (sport) {
      analyzePerformance.mutate(sport);
    }
  };
  
  return {
    metrics,
    analysis: analyzePerformance,
    runAnalysis,
    isLoading: metrics.isLoading || analyzePerformance.isPending,
  };
}

// Optimistic updates helper
export function useOptimisticPlanUpdate() {
  const queryClient = useQueryClient();
  
  const updatePlanOptimistically = (
    planId: string, 
    updateFn: (plan: PersonalizedPlan) => PersonalizedPlan
  ) => {
    queryClient.setQueryData(aiCoachKeys.currentPlan(), (oldData: PersonalizedPlan | null | undefined) => {
      if (oldData && oldData._id === planId) {
        return updateFn(oldData);
      }
      return oldData;
    });
  };
  
  return { updatePlanOptimistically };
}

// Real-time updates helper (for when implementing WebSocket)
export function useAICoachRealTimeUpdates() {
  const queryClient = useQueryClient();
  
  const handleRealTimeUpdate = (type: string, data: any) => {
    switch (type) {
      case 'plan_updated':
        queryClient.invalidateQueries({ queryKey: aiCoachKeys.currentPlan() });
        break;
      case 'new_insight':
        queryClient.invalidateQueries({ queryKey: aiCoachKeys.insights() });
        queryClient.invalidateQueries({ queryKey: aiCoachKeys.dashboard() });
        break;
      case 'metrics_updated':
        queryClient.invalidateQueries({ queryKey: aiCoachKeys.metrics() });
        queryClient.invalidateQueries({ queryKey: aiCoachKeys.dashboard() });
        break;
      default:
        break;
    }
  };
  
  return { handleRealTimeUpdate };
}
