import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true
});

// Add request interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Auto logout on 401 (Unauthorized) - token expired or invalid
    if (error.response?.status === 401) {
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  get: async <T>(endpoint: string): Promise<T> => {
    return api.get(endpoint);
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    return api.post(endpoint, data);
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    return api.put(endpoint, data);
  },

  patch: async <T>(endpoint: string, data: any): Promise<T> => {
    return api.patch(endpoint, data);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    return api.delete(endpoint);
  }
};
