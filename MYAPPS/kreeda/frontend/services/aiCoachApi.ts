import { apiClient } from './api';

// Type definitions
export interface WorkoutPlan {
  name: string;
  description: string;
  sport: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  frequency: number;
  exercises: Exercise[];
  goals: string[];
  createdBy: string;
}

export interface Exercise {
  name: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  instructions: string[];
  caloriesBurned: number;
  targetMuscles: string[];
  sport: string;
}

export interface PersonalizedPlan {
  _id: string;
  user: string;
  workoutPlan: WorkoutPlan;
  progress: {
    totalWorkouts: number;
    completedWorkouts: number;
    percentage: number;
  };
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
  adaptations?: Array<{
    reason: string;
    changes: string[];
    date: string;
  }>;
}

export interface PerformanceMetric {
  _id: string;
  user: string;
  sport: string;
  metrics: {
    endurance?: number;
    strength?: number;
    speed?: number;
    agility?: number;
    technique?: number;
    mental?: number;
  };
  overallScore: number;
  notes?: string;
  date: string;
}

export interface CoachingSession {
  _id: string;
  user: string;
  type: 'chat' | 'motivation' | 'performance_review';
  sport?: string;
  messages: Array<{
    role: 'user' | 'ai_coach';
    content: string;
    timestamp: string;
    metadata?: any;
  }>;
  recommendations?: string[];
  createdAt: string;
}

export interface AIInsight {
  _id: string;
  user: string;
  type: 'performance_trend' | 'goal_progress' | 'technique_focus' | 'milestone_achievement';
  title: string;
  description: string;
  sport: string;
  priority: 'high' | 'medium' | 'low';
  actionItems?: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    estimatedImpact: string;
  }>;
  viewed: boolean;
  viewedAt?: string;
  createdAt: string;
}

export interface WeeklyReport {
  weekPeriod: {
    start: string;
    end: string;
  };
  summary: {
    planProgress?: {
      planName: string;
      completionRate: string;
      workoutsCompleted: number;
      totalWorkouts: number;
    };
    performanceScore?: number;
  };
  achievements: string[];
  areasForImprovement: string[];
  nextWeekRecommendations: string[];
}

export interface DashboardData {
  activePlan?: {
    name: string;
    sport: string;
    progress: {
      totalWorkouts: number;
      completedWorkouts: number;
      percentage: number;
    };
    status: string;
  };
  recentInsights: AIInsight[];
  latestPerformance?: {
    sport: string;
    overallScore: number;
    date: string;
  };
  recentSessions: Array<{
    type: string;
    sport: string;
    createdAt: string;
  }>;
  weeklyStats: {
    metricsLogged: number;
    coachingSessions: number;
  };
}

// API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Client Class
export class AICoachApi {
  private baseUrl = '/ai-coach';

  // Training Plans
  async createPersonalizedPlan(data: {
    sport: string;
    goals: string[];
    duration?: number;
    difficulty?: string;
  }): Promise<PersonalizedPlan> {
    const response = await apiClient.post<ApiResponse<PersonalizedPlan>>(
      `${this.baseUrl}/plans`,
      data
    );
    return response.data.data;
  }

  async getCurrentPlan(): Promise<PersonalizedPlan | null> {
    try {
      const response = await apiClient.get<ApiResponse<PersonalizedPlan>>(
        `${this.baseUrl}/plans/current`
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getUserPlans(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<PersonalizedPlan[]>> {
    const response = await apiClient.get<ApiResponse<PersonalizedPlan[]>>(
      `${this.baseUrl}/plans`,
      { params }
    );
    return response.data;
  }

  async updatePlanProgress(planId: string, data: {
    workoutCompleted?: boolean;
    performanceData?: {
      metrics: any;
      overallScore: number;
      notes?: string;
    };
  }): Promise<PersonalizedPlan> {
    const response = await apiClient.put<ApiResponse<PersonalizedPlan>>(
      `${this.baseUrl}/plans/${planId}/progress`,
      data
    );
    return response.data.data;
  }

  async providePlanFeedback(planId: string, feedback: {
    difficulty?: 'too_easy' | 'too_hard' | 'just_right';
    rating?: number;
    comments?: string;
  }): Promise<PersonalizedPlan> {
    const response = await apiClient.post<ApiResponse<PersonalizedPlan>>(
      `${this.baseUrl}/plans/${planId}/feedback`,
      feedback
    );
    return response.data.data;
  }

  // Coaching Chat
  async sendChatMessage(data: {
    message: string;
    sessionType?: string;
    sport?: string;
  }): Promise<{
    message: string;
    recommendations: string[];
    sessionId: string;
    coachPersonality: string;
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.baseUrl}/chat`,
      data
    );
    return response.data.data;
  }

  async getChatSessions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    sport?: string;
  }): Promise<ApiResponse<CoachingSession[]>> {
    const response = await apiClient.get<ApiResponse<CoachingSession[]>>(
      `${this.baseUrl}/sessions`,
      { params }
    );
    return response.data;
  }

  // Performance Analysis
  async analyzePerformance(sport: string): Promise<{
    improvements: Array<{
      metric: string;
      improvement: string;
      message: string;
    }>;
    concerns: Array<{
      metric: string;
      decline: string;
      message: string;
    }>;
    recommendations: string[];
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.baseUrl}/analyze`,
      { sport }
    );
    return response.data.data;
  }

  async addPerformanceMetric(data: {
    sport: string;
    metrics: any;
    overallScore: number;
    notes?: string;
  }): Promise<PerformanceMetric> {
    const response = await apiClient.post<ApiResponse<PerformanceMetric>>(
      `${this.baseUrl}/metrics`,
      data
    );
    return response.data.data;
  }

  async getPerformanceMetrics(params?: {
    sport?: string;
    days?: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PerformanceMetric[]>> {
    const response = await apiClient.get<ApiResponse<PerformanceMetric[]>>(
      `${this.baseUrl}/metrics`,
      { params }
    );
    return response.data;
  }

  // Insights
  async getInsights(params?: {
    page?: number;
    limit?: number;
    type?: string;
    sport?: string;
    priority?: string;
  }): Promise<ApiResponse<AIInsight[]>> {
    const response = await apiClient.get<ApiResponse<AIInsight[]>>(
      `${this.baseUrl}/insights`,
      { params }
    );
    return response.data;
  }

  async markInsightViewed(insightId: string): Promise<AIInsight> {
    const response = await apiClient.put<ApiResponse<AIInsight>>(
      `${this.baseUrl}/insights/${insightId}/viewed`
    );
    return response.data.data;
  }

  // Reports
  async getWeeklyReport(): Promise<WeeklyReport> {
    const response = await apiClient.get<ApiResponse<WeeklyReport>>(
      `${this.baseUrl}/reports/weekly`
    );
    return response.data.data;
  }

  // Exercises Catalog
  async getAvailableExercises(params?: {
    sport?: string;
    difficulty?: string;
  }): Promise<Exercise[]> {
    const response = await apiClient.get<ApiResponse<Exercise[]>>(
      `${this.baseUrl}/exercises`,
      { params }
    );
    return response.data.data;
  }

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<ApiResponse<DashboardData>>(
      `${this.baseUrl}/dashboard`
    );
    return response.data.data;
  }
}

// Create singleton instance
export const aiCoachApi = new AICoachApi();
