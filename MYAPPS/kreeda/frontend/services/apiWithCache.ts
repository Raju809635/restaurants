import { apiClient } from './api';
import { cacheService } from './cache';

export const apiWithCache = {
  async get<T>(endpoint: string, cacheKey?: string, ttlMinutes: number = 30): Promise<T> {
    const key = cacheKey || endpoint;
    
    // Try cache first
    const cached = await cacheService.get<T>(key);
    if (cached) {
      return cached;
    }

    // Fetch from API
    const response = await apiClient.get<T>(endpoint);
    
    // Cache the result
    await cacheService.set(key, response.data, ttlMinutes);
    
    return response.data;
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await apiClient.post<T>(endpoint, data);
    return response.data;
  },

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await apiClient.put<T>(endpoint, data);
    return response.data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await apiClient.delete<T>(endpoint);
    return response.data;
  }
};