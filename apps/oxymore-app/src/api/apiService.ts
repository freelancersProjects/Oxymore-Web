const BASE_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  // Si pas de contenu (204), retourne null
  if (response.status === 204) return null;
  return response.json();
};

const apiService = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, method: 'GET' });
    return handleResponse(res);
  },
  post: async (endpoint: string, data?: any, options: RequestInit = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(res);
  },
  put: async (endpoint: string, data?: any, options: RequestInit = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(res);
  },
  patch: async (endpoint: string, data?: any, options: RequestInit = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(res);
  },
  delete: async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, method: 'DELETE' });
    return handleResponse(res);
  },
};

export default apiService;

// Ajout d'un export type pour TypeScript
export type { };
