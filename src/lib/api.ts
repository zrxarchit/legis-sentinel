import axios from 'axios';

const API_BASE_URL = 'https://0xarc.ogserver.eu.org';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Comment {
  comment: string;
  act: string;
  sentiment?: string;
}

export interface CommentResponse extends Comment {
  sentiment: string;
}

export interface HealthResponse {
  api: string;
  database: string;
}

export interface ActDetailsResponse {
  act: string;
  overall_sentiment: string;
  summary: string;
  word_list: string[];
  comments: Record<string, string>;
}

export const apiService = {
  // Add a new comment
  addComment: async (data: Comment): Promise<CommentResponse[]> => {
    const response = await api.post('/add', data);
    return response.data;
  },

  // Get health status
  getHealth: async (): Promise<HealthResponse> => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get details for a specific act
  getActDetails: async (act: string): Promise<ActDetailsResponse> => {
    const response = await api.get(`/fetch?act=${encodeURIComponent(act)}`);
    return response.data;
  },

  // Get all available acts
  getActs: async (): Promise<string[]> => {
    const response = await api.get('/acts');
    return response.data;
  },
};

export default api;