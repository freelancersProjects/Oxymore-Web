const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('useroxm');
      
      window.location.href = '/login';
    }
    
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  // Si pas de contenu (204), retourne null
  if (response.status === 204) return null;
  return response.json();
};

const apiService = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers
    });
    return handleResponse(res);
  },
  post: async (endpoint: string, data?: any) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(res);
  },
  put: async (endpoint: string, data?: any) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(res);
  },
  patch: async (endpoint: string, data?: any) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(res);
  },
  delete: async (endpoint: string) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse(res);
  },
};

export default apiService;
