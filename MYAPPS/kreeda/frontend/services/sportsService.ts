import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export interface Sport {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

export const sportsService = {
  async getAllSports(): Promise<Sport[]> {
    try {
      const response = await axios.get(`${API_URL}/sports`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      return [];
    }
  },

  async getSportById(id: string): Promise<Sport | null> {
    try {
      const response = await axios.get(`${API_URL}/sports/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sport ${id}:`, error);
      return null;
    }
  },
}; 